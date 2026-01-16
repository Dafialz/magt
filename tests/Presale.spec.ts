import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Presale } from '../build/Presale/Presale_Presale';
import '@ton/test-utils';

describe('Presale', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let presale: SandboxContract<Presale>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        presale = blockchain.openContract(await Presale.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await presale.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: presale.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and presale are ready to use
    });
});
