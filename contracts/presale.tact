// contracts/presale.tact
import "@stdlib/deploy";

/*
  Presale (Tact 1.6.13 compatible) — CLAIM variant
  - Buy: records claimable jettons for buyer (and optional referral) but DOES NOT send jettons
  - Claim: buyer pulls their accumulated jettons from Presale Jetton Wallet
  - Safer delivery: claim uses pending + bounce rollback (so claimable restored if jetton transfer bounces)

  ✅ FIX (critical #1):
  Fix op-codes (IDs) for ALL messages used by scripts.

  ✅ FIX (critical #2):
  Claim is non-empty (query_id) and uses fixed opcode "CLAI".

  ✅ FIX (critical #3):
  JettonTransfer forward_payload is Either (1-bit tag) + (ref cell) OR inline slice.
  We MUST store tag=1 before storeRef(cell).

  ✅ FIX (critical #4):
  DO NOT rely on typed JettonExcesses (ABI drift risk).
  Handle JettonExcesses ONLY via receive(inMsg: Slice).

  ✅ EXTRA HARDENING:
  - Bounce parser reads op+qid safely and tolerates short messages
  - Claim: ensure query_id is always > 0
*/

/* ===== fixed opcodes for our external/script messages ===== */
message(0x42555901) Buy {
  ref: Address;
}

// "CLAI"
message(0x434C4149) Claim {
  query_id: Int;
}

// "SJWL"
message(0x534A574C) SetJettonWallet {
  wallet: Address;
}

// "WITH"
message(0x57495448) Withdraw {
  amount: Int; // nanoTON
}

/* ===== Jetton standard transfer (TEP-74) =====
   op = 0x0f8a7ea5
   NOTE: we serialize MANUALLY, do not trust auto-ABI for forward_payload
*/
message(0x0f8a7ea5) JettonTransfer {
  query_id: Int;
  amount: Int;                 // nanojettons (9 decimals)
  destination: Address;        // receiver owner address
  response_destination: Address;
  custom_payload: Cell?;
  forward_ton_amount: Int;
  forward_payload: Slice;      // standard: Either ^slice, we serialize manually
}

contract Presale with Deployable {
  /* ==== config ==== */
  owner: Address;
  jettonMinter: Address;
  jettonWallet: Address?;

  /* ==== presale state ==== */
  totalRaised: Int;
  totalSold: Int;
  roundIndex: Int;
  roundSold: Int;
  referralPool: Int;

  /* ==== claim state ==== */
  claimable: map<Address, Int>;

  // single pending-claim lock (MVP)
  claimPending: Int; // 0/1
  claimQueryId: Int;
  claimAddr: Address?;
  claimAmount: Int;

  nextQueryId: Int;

  /* ==== constants ==== */
  const JETTON_DECIMALS: Int = 1000000000;
  const REF_PPM: Int = 250;
  const PPM_DEN: Int = 1000000;

  const JETTON_WALLET_CALL_VALUE: Int = 350000000; // 0.35 TON
  const FORWARD_TON_TO_CLAIMER: Int = 50000000;    // 0.05 TON

  const OP_JETTON_TRANSFER: Int = 0x0f8a7ea5;
  const OP_JETTON_EXCESSES: Int = 0xd53276db;

  init(owner: Address, jettonMinter: Address) {
    self.owner = owner;
    self.jettonMinter = jettonMinter;
    self.jettonWallet = null;

    self.totalRaised = 0;
    self.totalSold = 0;
    self.roundIndex = 0;
    self.roundSold = 0;

    self.referralPool = 25000000 * self.JETTON_DECIMALS;

    self.claimable = emptyMap();

    self.claimPending = 0;
    self.claimQueryId = 0;
    self.claimAddr = null;
    self.claimAmount = 0;

    self.nextQueryId = 1;
  }

  /* ===== rounds ===== */
  fun roundCapTokens(i: Int): Int {
    if (i == 0)  { return 65225022; }
    if (i == 1)  { return 57039669; }
    if (i == 2)  { return 50370908; }
    if (i == 3)  { return 44326399; }
    if (i == 4)  { return 39007231; }
    if (i == 5)  { return 34326365; }
    if (i == 6)  { return 30207200; }
    if (i == 7)  { return 26582336; }
    if (i == 8)  { return 23392455; }
    if (i == 9)  { return 20585361; }
    if (i == 10) { return 18115117; }
    if (i == 11) { return 15941303; }
    if (i == 12) { return 14028347; }
    if (i == 13) { return 12344945; }
    if (i == 14) { return 10863552; }
    if (i == 15) { return 9559925; }
    if (i == 16) { return 8412734; }
    if (i == 17) { return 7423267; }
    if (i == 18) { return 6514821; }
    return 5733043;
  }

  fun roundPriceNano(i: Int): Int {
    if (i == 0)  { return 11489000; }
    if (i == 1)  { return 13443000; }
    if (i == 2)  { return 15729000; }
    if (i == 3)  { return 18403000; }
    if (i == 4)  { return 21532000; }
    if (i == 5)  { return 25191000; }
    if (i == 6)  { return 29471000; }
    if (i == 7)  { return 34483000; }
    if (i == 8)  { return 40345000; }
    if (i == 9)  { return 47206000; }
    if (i == 10) { return 55231000; }
    if (i == 11) { return 64618000; }
    if (i == 12) { return 75603000; }
    if (i == 13) { return 88455000; }
    if (i == 14) { return 103495000; }
    if (i == 15) { return 121086000; }
    if (i == 16) { return 141671000; }
    if (i == 17) { return 165757000; }
    if (i == 18) { return 193935000; }
    return 226397000;
  }

  fun roundsCount(): Int { return 20; }

  /* ===== claimable helpers ===== */
  fun getClaimable(a: Address): Int {
    let v = self.claimable.get(a);
    if (v == null) { return 0; }
    return v!!;
  }

  fun addClaimable(a: Address, delta: Int) {
    require(delta > 0, "BAD_DELTA");
    let cur = self.getClaimable(a);
    self.claimable.set(a, cur + delta);
  }

  fun setClaimable(a: Address, v: Int) {
    if (v <= 0) {
      self.claimable.set(a, 0);
      return;
    }
    self.claimable.set(a, v);
  }

  /* ===== admin actions ===== */
  receive(msg: SetJettonWallet) {
    require(sender() == self.owner, "NOT_OWNER");
    // msg.wallet is Address (not optional) in Tact 1.6.13, so no null-check here
    self.jettonWallet = msg.wallet;
  }

  receive(msg: Withdraw) {
    require(sender() == self.owner, "NOT_OWNER");
    require(msg.amount > 0, "BAD_AMOUNT");
    require(myBalance() >= msg.amount, "NO_FUNDS");

    send(SendParameters{
      to: self.owner,
      value: msg.amount,
      bounce: false
    });
  }

  /* ===== buy entrypoints ===== */
  receive() {
    self.processBuy(null);
  }

  receive(msg: Buy) {
    if (msg.ref == sender()) {
      self.processBuy(null);
    } else {
      self.processBuy(msg.ref);
    }
  }

  /* ===== claim entrypoint ===== */
  receive(msg: Claim) {
    require(self.jettonWallet != null, "JETTON_WALLET_NOT_SET");
    require(self.claimPending == 0, "CLAIM_PENDING_TRY_LATER");

    let a = sender();
    let amount = self.getClaimable(a);
    require(amount > 0, "NOTHING_TO_CLAIM");

    // optimistic: set claimable to 0, restore on bounce if needed
    self.setClaimable(a, 0);

    let q = msg.query_id;
    if (q <= 0) {
      q = self.nextQueryId;
      self.nextQueryId = self.nextQueryId + 1;
    }
    // hard guarantee
    if (q <= 0) {
      q = 1;
    }

    self.claimPending = 1;
    self.claimQueryId = q;
    self.claimAddr = a;
    self.claimAmount = amount;

    self.sendJettonTo(a, amount, q);
  }

  /* ===== bounce rollback ===== */
  bounced(inMsg: Slice) {
    // Bounce body for JettonTransfer should begin with op(32) + query_id(64)
    if (inMsg.bits() < 32) { return; }
    let op = inMsg.loadUint(32);
    if (op != self.OP_JETTON_TRANSFER) { return; }

    if (inMsg.bits() < 64) { return; }
    let qid = inMsg.loadUint(64);

    if (self.claimPending == 1 && qid == self.claimQueryId) {
      let a = self.claimAddr;
      if (a != null && self.claimAmount > 0) {
        self.addClaimable(a!!, self.claimAmount);
      }

      self.claimPending = 0;
      self.claimQueryId = 0;
      self.claimAddr = null;
      self.claimAmount = 0;
    }
  }

  /* ===== ABI-safe JettonExcesses handler (ONLY Slice) ===== */
  receive(inMsg: Slice) {
    if (inMsg.bits() < 32) { return; }
    let op = inMsg.preloadUint(32);

    if (op == self.OP_JETTON_EXCESSES) {
      let s = inMsg;
      s.loadUint(32);

      if (s.bits() < 64) { return; }
      let qid = s.loadUint(64);

      if (self.claimPending == 1 && qid == self.claimQueryId) {
        self.claimPending = 0;
        self.claimQueryId = 0;
        self.claimAddr = null;
        self.claimAmount = 0;
      }
      return;
    }
  }

  /* ===== core buy logic ===== */
  fun processBuy(ref: Address?) {
    require(self.jettonWallet != null, "JETTON_WALLET_NOT_SET");

    let buyer = sender();
    let tonIn = context().value;
    require(tonIn > 0, "NO_TON");

    self.totalRaised = self.totalRaised + tonIn;

    let tonLeft: Int = tonIn;
    let boughtNano: Int = 0;

    while (tonLeft > 0 && self.roundIndex < self.roundsCount()) {
      let capNano = self.roundCapTokens(self.roundIndex) * self.JETTON_DECIMALS;
      let priceNano = self.roundPriceNano(self.roundIndex);
      let remainNano = capNano - self.roundSold;

      if (remainNano <= 0) {
        self.roundIndex = self.roundIndex + 1;
        self.roundSold = 0;
      } else {
        let affordableNano = (tonLeft * self.JETTON_DECIMALS) / priceNano;

        if (affordableNano <= 0) {
          tonLeft = 0;
        } else {
          let toBuyNano = affordableNano;
          if (toBuyNano > remainNano) {
            toBuyNano = remainNano;
          }

          let costNano = (toBuyNano * priceNano) / self.JETTON_DECIMALS;

          if (costNano <= 0 || costNano > tonLeft) {
            tonLeft = 0;
          } else {
            tonLeft = tonLeft - costNano;

            self.roundSold = self.roundSold + toBuyNano;
            self.totalSold = self.totalSold + toBuyNano;
            boughtNano = boughtNano + toBuyNano;

            if (self.roundSold >= capNano) {
              self.roundIndex = self.roundIndex + 1;
              self.roundSold = 0;
            }
          }
        }
      }
    }

    require(boughtNano > 0, "NOT_ENOUGH_TON");

    self.addClaimable(buyer, boughtNano);

    if (ref != null) {
      let r = ref!!;
      if (r != buyer) {
        let bonus = (boughtNano * self.REF_PPM) / self.PPM_DEN;
        if (bonus > 0 && self.referralPool > 0) {
          if (bonus > self.referralPool) { bonus = self.referralPool; }
          if (bonus > 0) {
            self.referralPool = self.referralPool - bonus;
            self.addClaimable(r, bonus);
          }
        }
      }
    }

    if (tonLeft > 0) {
      send(SendParameters{
        to: buyer,
        value: tonLeft,
        bounce: false
      });
    }
  }

  /* ===== Jetton transfer serialization (manual) ===== */
  fun sendJettonTo(to: Address, amountNano: Int, queryId: Int) {
    let w = self.jettonWallet;
    require(w != null, "JETTON_WALLET_NOT_SET");

    // forward_payload = Either:
    //  - 0 + inline slice
    //  - 1 + ref(cell)
    // We send tag=1 and then storeRef(empty cell)
    let forwardPayloadCell = beginCell().endCell();

    let body = beginCell()
      .storeUint(self.OP_JETTON_TRANSFER, 32)
      .storeUint(queryId, 64)
      .storeCoins(amountNano)
      .storeAddress(to)
      .storeAddress(myAddress())
      .storeMaybeRef(null)
      .storeCoins(self.FORWARD_TON_TO_CLAIMER)
      .storeUint(1, 1)              // ✅ tag: forward_payload in ref
      .storeRef(forwardPayloadCell) // ✅ payload cell
      .endCell();

    send(SendParameters{
      to: w!!,
      value: self.JETTON_WALLET_CALL_VALUE,
      bounce: true,
      body: body
    });
  }

  /* ===== getters ===== */
  get fun totalRaisedNano(): Int { return self.totalRaised; }
  get fun totalSoldNano(): Int { return self.totalSold; }
  get fun currentRound(): Int { return self.roundIndex; }
  get fun currentRoundSoldNano(): Int { return self.roundSold; }
  get fun referralPoolNano(): Int { return self.referralPool; }

  get fun jettonWalletSet(): Int {
    if (self.jettonWallet != null) { return 1; }
    return 0;
  }

  get fun jettonMinterAddr(): Address { return self.jettonMinter; }

  get fun claimableNano(a: Address): Int {
    return self.getClaimable(a);
  }

  get fun claimPendingNow(): Int { return self.claimPending; }
  get fun claimPendingQuery(): Int { return self.claimQueryId; }
}
