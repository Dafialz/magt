// 🔹 ІМПОРТИ ПРАПОРІВ (Vite way — працює і локально, і на Netlify)
import flagBD from "../assets/lang/bd.png";
import flagCN from "../assets/lang/cn.png";
import flagEN from "../assets/lang/en.png";
import flagES from "../assets/lang/es.png";
import flagFR from "../assets/lang/fr.png";
import flagID from "../assets/lang/id.png";
import flagIN from "../assets/lang/in.png";
import flagPT from "../assets/lang/pt.png";
import flagRU from "../assets/lang/ru.png";
import flagSA from "../assets/lang/sa.png";
import flagUK from "../assets/lang/uk.png";

export const LANGS = [
  { code: "en", label: "EN" },
  { code: "uk", label: "UA" },
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "pt", label: "PT" },
  { code: "cn", label: "CN" },
  { code: "in", label: "IN" },
  { code: "id", label: "ID" },
  { code: "sa", label: "SA" },
  { code: "bd", label: "BD" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

// ✅ ТЕПЕР ПРАПОРИ ПРАЦЮЮТЬ СКРІЗЬ
export const FLAG_ICON: Record<LangCode, string> = {
  en: flagEN,
  uk: flagUK,
  ru: flagRU,
  es: flagES,
  fr: flagFR,
  pt: flagPT,
  cn: flagCN,
  in: flagIN,
  id: flagID,
  sa: flagSA,
  bd: flagBD,
};

const STORAGE_KEY = "magt_lang";

export function getSavedLang(): LangCode {
  const raw = (localStorage.getItem(STORAGE_KEY) ?? "").toLowerCase();
  const v = raw as LangCode;
  return (LANGS as readonly any[]).some((x) => x.code === v) ? v : "en";
}

export function saveLang(code: LangCode) {
  // store normalized lowercase code (prevents "RU"/"EN" bugs)
  localStorage.setItem(STORAGE_KEY, String(code).toLowerCase());
}

/* ====== DICTIONARY ====== */

const EN = {
  trust_title: "Why trust us",
  tokenomics_title: "Tokenomics",
  roadmap_title: "Roadmap",
  faq_title: "FAQ",
  copy_ref: "Copy referral link",
  copied: "Copied!",
  total_supply: "Total supply",
  presale: "Presale",
  liquidity: "Liquidity",
  team: "Team",
  marketing: "Marketing",
  other: "Other projects",
  faq_q1: "What is MAGIC TIME?",
  faq_a1: "MAGIC TIME is a TON-based blockchain project focused on building a scalable ecosystem where time-based mechanics meet decentralized finance. The presale allows early supporters to acquire MAGT tokens before public listing.\n\nMagicTime is an innovative crypto project where time becomes a digital asset. Each MagicTime token represents a fragment of time that can be invested, exchanged, and used within a unique ecosystem. The platform combines blockchain technology with a magical user experience, allowing participants to “control time” and convert it into real value. Dive into MagicTime and build a future where every second matters.",
  faq_q2: "What is MAGT?",
  faq_a2: "MAGT is the native utility token of the MAGIC TIME ecosystem. It is used for ecosystem access, rewards, future products, and governance features.",
  faq_q3: "What network is used?",
  faq_a3: "MAGIC TIME is built on The Open Network (TON), ensuring fast transactions, low fees, and seamless wallet integration.",
  faq_q4: "How does the presale work?",
  faq_a4: "Participants send TON to the presale smart contract. Purchased tokens are recorded on-chain and become claimable via the Claim function.",
  faq_q5: "Do I receive tokens immediately after purchase?",
  faq_a5: "No. Tokens are not transferred instantly. Instead, they become claimable, and you can withdraw them later using the Claim button.\n\nThis approach increases security and prevents failed deliveries.",
  faq_q6: "When can I claim my tokens?",
  faq_a6: "Tokens can be claimed after the presale contract allows claiming. Once enabled, you can withdraw your available MAGT at any time using the Claim button.",
  faq_q7: "Is there a vesting or lockup?",
  faq_a7: "Yes. Presale tokens are subject to a vesting and lockup schedule, which will be published before public listing to ensure long-term project stability.",
  faq_q8: "What percentage of tokens is allocated to presale?",
  faq_a8: "5% of the total token supply is allocated to this presale round. Unsold tokens will be reserved for future ecosystem development and projects.",
  faq_q9: "Is there a referral program?",
  faq_a9: "Yes. You can earn additional MAGT tokens by sharing your referral link. Referral rewards are accumulated and can be withdrawn using the same Claim mechanism.",
  faq_q10: "Who can see referral rewards?",
  faq_a10: "Only the referral owner (the wallet that shared the referral link) can see and claim referral rewards.",
  faq_q11: "Which wallets are supported?",
  faq_a11: "All TON Connect–compatible wallets are supported, including Tonkeeper, Telegram Wallet, MyTonWallet, and other supported TON wallets.",
  faq_q12: "Is the smart contract audited?",
  faq_a12: "The smart contract is open-source and available for public review. Audit status will be announced separately.",
  faq_q13: "Can I sell or transfer MAGT during presale?",
  faq_a13: "No. MAGT tokens cannot be transferred or traded until after the presale and official listing.",
  faq_q14: "What happens if a transaction fails?",
  faq_a14: "If a transaction fails or is partially filled, unused TON is automatically refunded and claimable balances are safely restored on-chain.",
  faq_q15: "Is my investment safe?",
  faq_a15: "All presale logic is handled by on-chain smart contracts. There is no manual intervention, no custodial wallets, and no off-chain balances.\n\nHowever, like any crypto investment, participation carries risk.",
  faq_q16: "Where can I follow project updates?",
  faq_a16: "Official announcements and updates will be published through the website, social channels, and community platforms.",
};

export const DICT: Record<LangCode, Record<string, string>> = {
  en: EN,

  uk: {
    app__your_magt: "Твій MAGT",
    app__claim: "Отримати",
    presale_progress__total_presale: "Усього пресейл",

    trust_title: "Чому нам довіряти",
    tokenomics_title: "Токеноміка",
    roadmap_title: "Дорожня карта",
    faq_title: "FAQ",
    copy_ref: "Скопіювати реф. лінк",
    copied: "Скопійовано!",
    total_supply: "Загальна емісія",
    presale: "Пресейл",
    liquidity: "Ліквідність",
    team: "Команда",
    marketing: "Маркетинг",
    other: "Інші проєкти",
    faq_q1: "Що таке MAGIC TIME?",
    faq_a1: "MAGIC TIME — це блокчейн‑проєкт на TON, який будує масштабовану екосистему, де механіки, пов’язані з часом, поєднуються з децентралізованими фінансами. Пресейл дає раннім прихильникам можливість отримати токени MAGT до публічного лістингу.\n\nMagicTime — інноваційний криптопроєкт, у якому час стає цифровим активом. Кожен токен MagicTime — це фрагмент часу, який можна інвестувати, обмінювати та використовувати в унікальній екосистемі. Платформа поєднує блокчейн‑технології з магічним користувацьким досвідом, дозволяючи учасникам «керувати часом» і конвертувати його в реальну цінність. Пірнай у MagicTime та створи майбутнє, де кожна секунда має значення.",
    faq_q2: "Що таке MAGT?",
    faq_a2: "MAGT — нативний утиліті‑токен екосистеми MAGIC TIME. Він використовується для доступу до екосистеми, винагород, майбутніх продуктів і функцій управління.",
    faq_q3: "Яка мережа використовується?",
    faq_a3: "MAGIC TIME побудований на The Open Network (TON), що забезпечує швидкі транзакції, низькі комісії та зручну інтеграцію гаманців.",
    faq_q4: "Як працює пресейл?",
    faq_a4: "Учасники надсилають TON у смарт‑контракт пресейлу. Куплені токени фіксуються ончейн і стають доступними до отримання через функцію Claim.",
    faq_q5: "Чи отримую я токени одразу після покупки?",
    faq_a5: "Ні. Токени не надсилаються миттєво. Замість цього вони стають доступними до отримання, і ви можете вивести їх пізніше через кнопку Claim.\n\nТакий підхід підвищує безпеку та запобігає невдалим доставкам.",
    faq_q6: "Коли я можу отримати свої токени?",
    faq_a6: "Токени можна отримати після того, як контракт пресейлу увімкне можливість claim. Після активації ви можете виводити доступні MAGT у будь‑який час через кнопку Claim.",
    faq_q7: "Чи є вестинг або локап?",
    faq_a7: "Так. Токени пресейлу підпадають під графік вестингу та блокування, який буде опубліковано до публічного лістингу, щоб забезпечити довгострокову стабільність проєкту.",
    faq_q8: "Який відсоток токенів виділено на пресейл?",
    faq_a8: "5% від загальної емісії токенів виділено на цей раунд пресейлу. Непродані токени будуть зарезервовані для майбутнього розвитку екосистеми та проєктів.",
    faq_q9: "Чи є реферальна програма?",
    faq_a9: "Так. Ви можете заробляти додаткові токени MAGT, поширюючи свій реферальний лінк. Реферальні винагороди накопичуються та можуть бути виведені тим самим механізмом Claim.",
    faq_q10: "Хто бачить реферальні винагороди?",
    faq_a10: "Лише власник рефералу (гаманець, який поділився реферальним лінком) може бачити та отримувати реферальні винагороди.",
    faq_q11: "Які гаманці підтримуються?",
    faq_a11: "Підтримуються всі гаманці, сумісні з TON Connect, включно з Tonkeeper, Telegram Wallet, MyTonWallet та іншими підтримуваними TON‑гаманцями.",
    faq_q12: "Чи пройшов смарт‑контракт аудит?",
    faq_a12: "Смарт‑контракт є open‑source і доступний для публічного перегляду. Статус аудиту буде оголошено окремо.",
    faq_q13: "Чи можу я продати або переказати MAGT під час пресейлу?",
    faq_a13: "Ні. Токени MAGT не можна переказувати або торгувати ними до завершення пресейлу та офіційного лістингу.",
    faq_q14: "Що буде, якщо транзакція не пройде?",
    faq_a14: "Якщо транзакція не пройшла або була виконана частково, невикористаний TON автоматично повертається, а баланси до отримання безпечно відновлюються ончейн.",
    faq_q15: "Чи безпечні мої кошти?",
    faq_a15: "Уся логіка пресейлу реалізована ончейн смарт‑контрактами. Немає ручного втручання, кастодіальних гаманців чи офчейн балансів.\n\nОднак, як і будь‑які криптоінвестиції, участь пов’язана з ризиком.",
    faq_q16: "Де стежити за оновленнями проєкту?",
    faq_a16: "Офіційні оголошення та оновлення будуть публікуватися на сайті, у соціальних каналах і на платформах спільноти.",
  },

  ru: {
    app__your_magt: "Ваш MAGT",
    app__claim: "Получить",
    presale_progress__total_presale: "Всего пресейл",

    trust_title: "Почему нам доверять",
    tokenomics_title: "Токеномика",
    roadmap_title: "Дорожная карта",
    faq_title: "FAQ",
    copy_ref: "Скопировать реф. ссылку",
    copied: "Скопировано!",
    total_supply: "Общая эмиссия",
    presale: "Пресейл",
    liquidity: "Ликвидность",
    team: "Команда",
    marketing: "Маркетинг",
    other: "Другие проекты",
    faq_q1: "Что такое MAGIC TIME?",
    faq_a1: "MAGIC TIME — блокчейн‑проект на TON, нацеленный на создание масштабируемой экосистемы, где механики, связанные со временем, сочетаются с децентрализованными финансами. Пресейл позволяет ранним сторонникам приобрести токены MAGT до публичного листинга.\n\nMagicTime — инновационный криптопроект, где время становится цифровым активом. Каждый токен MagicTime представляет собой фрагмент времени, который можно инвестировать, обменивать и использовать в уникальной экосистеме. Платформа сочетает блокчейн‑технологии с магическим пользовательским опытом, позволяя участникам «управлять временем» и конвертировать его в реальную ценность. Погружайся в MagicTime и создавай будущее, где каждая секунда имеет значение.",
    faq_q2: "Что такое MAGT?",
    faq_a2: "MAGT — нативный utility‑токен экосистемы MAGIC TIME. Он используется для доступа к экосистеме, вознаграждений, будущих продуктов и функций управления.",
    faq_q3: "Какая сеть используется?",
    faq_a3: "MAGIC TIME построен на The Open Network (TON), обеспечивая быстрые транзакции, низкие комиссии и удобную интеграцию кошельков.",
    faq_q4: "Как работает пресейл?",
    faq_a4: "Участники отправляют TON в смарт‑контракт пресейла. Купленные токены фиксируются ончейн и становятся доступными к получению через функцию Claim.",
    faq_q5: "Я получаю токены сразу после покупки?",
    faq_a5: "Нет. Токены не переводятся мгновенно. Вместо этого они становятся доступными к получению, и вы можете вывести их позже с помощью кнопки Claim.\n\nТакой подход повышает безопасность и предотвращает неудачные доставки.",
    faq_q6: "Когда я могу получить свои токены?",
    faq_a6: "Токены можно получить после того, как контракт пресейла разрешит claim. После активации вы можете выводить доступные MAGT в любое время через кнопку Claim.",
    faq_q7: "Есть ли вестинг или локап?",
    faq_a7: "Да. Токены пресейла подпадают под график вестинга и блокировки, который будет опубликован до публичного листинга для обеспечения долгосрочной стабильности проекта.",
    faq_q8: "Какой процент токенов выделен на пресейл?",
    faq_a8: "5% от общего предложения токенов выделено на этот раунд пресейла. Непроданные токены будут зарезервированы для будущего развития экосистемы и проектов.",
    faq_q9: "Есть ли реферальная программа?",
    faq_a9: "Да. Вы можете зарабатывать дополнительные токены MAGT, делясь своей реферальной ссылкой. Реферальные награды накапливаются и могут быть выведены тем же механизмом Claim.",
    faq_q10: "Кто может видеть реферальные награды?",
    faq_a10: "Только владелец реферала (кошелек, который поделился реферальной ссылкой) может видеть и получать реферальные награды.",
    faq_q11: "Какие кошельки поддерживаются?",
    faq_a11: "Поддерживаются все кошельки, совместимые с TON Connect, включая Tonkeeper, Telegram Wallet, MyTonWallet и другие поддерживаемые TON‑кошельки.",
    faq_q12: "Контракт прошел аудит?",
    faq_a12: "Смарт‑контракт является open‑source и доступен для публичного просмотра. Статус аудита будет объявлен отдельно.",
    faq_q13: "Могу ли я продать или перевести MAGT во время пресейла?",
    faq_a13: "Нет. Токены MAGT нельзя переводить или торговать ими до завершения пресейла и официального листинга.",
    faq_q14: "Что будет, если транзакция не пройдет?",
    faq_a14: "Если транзакция не прошла или была выполнена частично, неиспользованный TON автоматически возвращается, а балансы к получению безопасно восстанавливаются ончейн.",
    faq_q15: "Безопасны ли мои средства?",
    faq_a15: "Вся логика пресейла выполняется ончейн смарт‑контрактами. Нет ручного вмешательства, кастодиальных кошельков и офчейн балансов.\n\nОднако, как и любые криптоинвестиции, участие несет риск.",
    faq_q16: "Где следить за обновлениями проекта?",
    faq_a16: "Официальные объявления и обновления будут публиковаться на сайте, в социальных каналах и на платформах сообщества.",
  },

  es: {
    app__your_magt: "Tu MAGT",
    app__claim: "Reclamar",
    presale_progress__total_presale: "Total de preventa",

    trust_title: "Por qué confiar",
    tokenomics_title: "Tokenomics",
    roadmap_title: "Hoja de ruta",
    faq_title: "FAQ",
    copy_ref: "Copiar enlace referral",
    copied: "¡Copiado!",
    total_supply: "Suministro total",
    presale: "Preventa",
    liquidity: "Liquidez",
    team: "Equipo",
    marketing: "Marketing",
    other: "Otros proyectos",
    faq_q1: "¿Qué es MAGIC TIME?",
    faq_a1: "MAGIC TIME es un proyecto blockchain basado en TON enfocado en construir un ecosistema escalable donde las mecánicas basadas en el tiempo se unen con las finanzas descentralizadas. La preventa permite a los primeros seguidores adquirir tokens MAGT antes del listado público.\n\nMagicTime es un proyecto cripto innovador donde el tiempo se convierte en un activo digital. Cada token MagicTime representa un fragmento de tiempo que puede invertirse, intercambiarse y usarse dentro de un ecosistema único. La plataforma combina la tecnología blockchain con una experiencia de usuario “mágica”, permitiendo a los participantes “controlar el tiempo” y convertirlo en valor real. Sumérgete en MagicTime y construye un futuro donde cada segundo importa.",
    faq_q2: "¿Qué es MAGT?",
    faq_a2: "MAGT es el token utilitario nativo del ecosistema MAGIC TIME. Se utiliza para el acceso al ecosistema, recompensas, productos futuros y funciones de gobernanza.",
    faq_q3: "¿Qué red se utiliza?",
    faq_a3: "MAGIC TIME está construido sobre The Open Network (TON), lo que garantiza transacciones rápidas, comisiones bajas e integración fluida con billeteras.",
    faq_q4: "¿Cómo funciona la preventa?",
    faq_a4: "Los participantes envían TON al contrato inteligente de la preventa. Los tokens comprados se registran en la cadena y pasan a ser reclamables mediante la función Claim.",
    faq_q5: "¿Recibo los tokens inmediatamente después de comprar?",
    faq_a5: "No. Los tokens no se transfieren al instante. En su lugar, pasan a ser reclamables y puedes retirarlos más tarde usando el botón Claim.\n\nEste enfoque aumenta la seguridad y evita entregas fallidas.",
    faq_q6: "¿Cuándo puedo reclamar mis tokens?",
    faq_a6: "Los tokens pueden reclamarse después de que el contrato de preventa habilite el claim. Una vez activado, puedes retirar tus MAGT disponibles en cualquier momento usando el botón Claim.",
    faq_q7: "¿Hay vesting o bloqueo?",
    faq_a7: "Sí. Los tokens de preventa están sujetos a un calendario de vesting y bloqueo, que se publicará antes del listado público para garantizar la estabilidad a largo plazo del proyecto.",
    faq_q8: "¿Qué porcentaje de tokens se asigna a la preventa?",
    faq_a8: "El 5% del suministro total de tokens se asigna a esta ronda de preventa. Los tokens no vendidos se reservarán para el desarrollo futuro del ecosistema y proyectos.",
    faq_q9: "¿Existe un programa de referidos?",
    faq_a9: "Sí. Puedes ganar tokens MAGT adicionales compartiendo tu enlace de referido. Las recompensas por referido se acumulan y pueden retirarse mediante el mismo mecanismo de Claim.",
    faq_q10: "¿Quién puede ver las recompensas por referido?",
    faq_a10: "Solo el propietario del referido (la billetera que compartió el enlace) puede ver y reclamar las recompensas por referido.",
    faq_q11: "¿Qué billeteras son compatibles?",
    faq_a11: "Se admiten todas las billeteras compatibles con TON Connect, incluidas Tonkeeper, Telegram Wallet, MyTonWallet y otras billeteras TON compatibles.",
    faq_q12: "¿El contrato inteligente está auditado?",
    faq_a12: "El contrato inteligente es de código abierto y está disponible para revisión pública. El estado de la auditoría se anunciará por separado.",
    faq_q13: "¿Puedo vender o transferir MAGT durante la preventa?",
    faq_a13: "No. Los tokens MAGT no pueden transferirse ni negociarse hasta después de la preventa y del listado oficial.",
    faq_q14: "¿Qué pasa si una transacción falla?",
    faq_a14: "Si una transacción falla o se ejecuta parcialmente, el TON no utilizado se reembolsa automáticamente y los saldos reclamables se restauran de forma segura en la cadena.",
    faq_q15: "¿Mi inversión es segura?",
    faq_a15: "Toda la lógica de la preventa está gestionada por contratos inteligentes on-chain. No hay intervención manual, ni billeteras custodiadas, ni saldos off-chain.\n\nSin embargo, como cualquier inversión cripto, participar conlleva riesgo.",
    faq_q16: "¿Dónde puedo seguir las actualizaciones del proyecto?",
    faq_a16: "Los anuncios y actualizaciones oficiales se publicarán a través del sitio web, los canales sociales y las plataformas de la comunidad.",
  },

  fr: {
    app__your_magt: "Votre MAGT",
    app__claim: "Réclamer",
    presale_progress__total_presale: "Total de la prévente",

    trust_title: "Pourquoi nous faire confiance",
    tokenomics_title: "Tokenomics",
    roadmap_title: "Feuille de route",
    faq_title: "FAQ",
    copy_ref: "Copier le lien de parrainage",
    copied: "Copié !",
    total_supply: "Offre totale",
    presale: "Prévente",
    liquidity: "Liquidité",
    team: "Équipe",
    marketing: "Marketing",
    other: "Autres projets",
    faq_q1: "Qu’est-ce que MAGIC TIME ?",
    faq_a1: "MAGIC TIME est un projet blockchain basé sur TON, visant à construire un écosystème évolutif où des mécaniques liées au temps rencontrent la finance décentralisée. La prévente permet aux premiers soutiens d’acquérir des tokens MAGT avant le listing public.\n\nMagicTime est un projet crypto innovant où le temps devient un actif numérique. Chaque token MagicTime représente un fragment de temps pouvant être investi, échangé et utilisé au sein d’un écosystème unique. La plateforme combine la technologie blockchain avec une expérience utilisateur “magique”, permettant aux participants de « contrôler le temps » et de le convertir en valeur réelle. Plonge dans MagicTime et construis un avenir où chaque seconde compte.",
    faq_q2: "Qu’est-ce que MAGT ?",
    faq_a2: "MAGT est le token utilitaire natif de l’écosystème MAGIC TIME. Il sert à l’accès à l’écosystème, aux récompenses, aux produits futurs et aux fonctionnalités de gouvernance.",
    faq_q3: "Quel réseau est utilisé ?",
    faq_a3: "MAGIC TIME est construit sur The Open Network (TON), garantissant des transactions rapides, des frais faibles et une intégration fluide des portefeuilles.",
    faq_q4: "Comment fonctionne la prévente ?",
    faq_a4: "Les participants envoient des TON au smart contract de prévente. Les tokens achetés sont enregistrés on-chain et deviennent réclamables via la fonction Claim.",
    faq_q5: "Reçois‑je les tokens immédiatement après l’achat ?",
    faq_a5: "Non. Les tokens ne sont pas transférés instantanément. Ils deviennent réclamables et vous pouvez les retirer plus tard via le bouton Claim.\n\nCette approche renforce la sécurité et évite les livraisons échouées.",
    faq_q6: "Quand puis‑je réclamer mes tokens ?",
    faq_a6: "Les tokens peuvent être réclamés une fois que le contrat de prévente autorise le claim. Une fois activé, vous pouvez retirer vos MAGT disponibles à tout moment via le bouton Claim.",
    faq_q7: "Y a‑t‑il un vesting ou une période de blocage ?",
    faq_a7: "Oui. Les tokens de prévente sont soumis à un calendrier de vesting et de blocage, qui sera publié avant le listing public afin d’assurer la stabilité à long terme du projet.",
    faq_q8: "Quel pourcentage de tokens est alloué à la prévente ?",
    faq_a8: "5 % de l’offre totale de tokens est alloué à cette ronde de prévente. Les tokens invendus seront réservés au développement futur de l’écosystème et des projets.",
    faq_q9: "Y a‑t‑il un programme de parrainage ?",
    faq_a9: "Oui. Vous pouvez gagner des tokens MAGT supplémentaires en partageant votre lien de parrainage. Les récompenses de parrainage s’accumulent et peuvent être retirées via le même mécanisme Claim.",
    faq_q10: "Qui peut voir les récompenses de parrainage ?",
    faq_a10: "Seul le propriétaire du parrainage (le portefeuille qui a partagé le lien) peut voir et réclamer les récompenses de parrainage.",
    faq_q11: "Quels portefeuilles sont pris en charge ?",
    faq_a11: "Tous les portefeuilles compatibles TON Connect sont pris en charge, notamment Tonkeeper, Telegram Wallet, MyTonWallet et d’autres portefeuilles TON compatibles.",
    faq_q12: "Le smart contract est‑il audité ?",
    faq_a12: "Le smart contract est open‑source et disponible pour une revue publique. Le statut de l’audit sera annoncé séparément.",
    faq_q13: "Puis‑je vendre ou transférer des MAGT pendant la prévente ?",
    faq_a13: "Non. Les tokens MAGT ne peuvent pas être transférés ni échangés avant la fin de la prévente et le listing officiel.",
    faq_q14: "Que se passe‑t‑il si une transaction échoue ?",
    faq_a14: "Si une transaction échoue ou n’est remplie que partiellement, les TON inutilisés sont automatiquement remboursés et les soldes réclamables sont restaurés en toute sécurité on‑chain.",
    faq_q15: "Mon investissement est‑il sûr ?",
    faq_a15: "Toute la logique de la prévente est gérée par des smart contracts on‑chain. Il n’y a aucune intervention manuelle, aucun portefeuille custodial et aucun solde off‑chain.\n\nCependant, comme tout investissement crypto, la participation comporte des risques.",
    faq_q16: "Où puis‑je suivre les mises à jour du projet ?",
    faq_a16: "Les annonces et mises à jour officielles seront publiées via le site web, les réseaux sociaux et les plateformes communautaires.",
  },

  pt: {
    app__your_magt: "Seu MAGT",
    app__claim: "Reivindicar",
    presale_progress__total_presale: "Total da pré-venda",

    trust_title: "Por que confiar",
    tokenomics_title: "Tokenomics",
    roadmap_title: "Roadmap",
    faq_title: "FAQ",
    copy_ref: "Copiar link de referral",
    copied: "Copiado!",
    total_supply: "Oferta total",
    presale: "Pré-venda",
    liquidity: "Liquidez",
    team: "Equipe",
    marketing: "Marketing",
    other: "Outros projetos",
    faq_q1: "O que é MAGIC TIME?",
    faq_a1: "MAGIC TIME é um projeto blockchain baseado em TON focado em construir um ecossistema escalável onde mecânicas baseadas em tempo se encontram com finanças descentralizadas. A pré-venda permite que os primeiros apoiadores adquiram tokens MAGT antes do listing público.\n\nMagicTime é um projeto cripto inovador onde o tempo se torna um ativo digital. Cada token MagicTime representa um fragmento de tempo que pode ser investido, trocado e usado dentro de um ecossistema único. A plataforma combina a tecnologia blockchain com uma experiência de usuário “mágica”, permitindo que os participantes “controlem o tempo” e o convertam em valor real. Mergulhe no MagicTime e construa um futuro onde cada segundo importa.",
    faq_q2: "O que é MAGT?",
    faq_a2: "MAGT é o token utilitário nativo do ecossistema MAGIC TIME. Ele é usado para acesso ao ecossistema, recompensas, produtos futuros e recursos de governança.",
    faq_q3: "Qual rede é usada?",
    faq_a3: "MAGIC TIME é construído na The Open Network (TON), garantindo transações rápidas, baixas taxas e integração perfeita com carteiras.",
    faq_q4: "Como funciona a pré-venda?",
    faq_a4: "Os participantes enviam TON para o smart contract da pré-venda. Os tokens comprados são registrados on-chain e se tornam resgatáveis via a função Claim.",
    faq_q5: "Recebo os tokens imediatamente após a compra?",
    faq_a5: "Não. Os tokens não são transferidos instantaneamente. Em vez disso, eles se tornam resgatáveis e você pode retirá-los depois usando o botão Claim.\n\nEssa abordagem aumenta a segurança e evita entregas falhas.",
    faq_q6: "Quando posso resgatar meus tokens?",
    faq_a6: "Os tokens podem ser resgatados depois que o contrato da pré-venda permitir o claim. Uma vez habilitado, você pode retirar seus MAGT disponíveis a qualquer momento usando o botão Claim.",
    faq_q7: "Há vesting ou bloqueio?",
    faq_a7: "Sim. Os tokens da pré-venda estão sujeitos a um cronograma de vesting e bloqueio, que será publicado antes do listing público para garantir a estabilidade de longo prazo do projeto.",
    faq_q8: "Qual porcentagem de tokens é alocada para a pré-venda?",
    faq_a8: "5% do suprimento total de tokens é alocado para esta rodada de pré-venda. Tokens não vendidos serão reservados para o desenvolvimento futuro do ecossistema e projetos.",
    faq_q9: "Existe programa de indicação?",
    faq_a9: "Sim. Você pode ganhar tokens MAGT adicionais compartilhando seu link de indicação. As recompensas de indicação são acumuladas e podem ser retiradas usando o mesmo mecanismo de Claim.",
    faq_q10: "Quem pode ver as recompensas de indicação?",
    faq_a10: "Apenas o dono da indicação (a carteira que compartilhou o link) pode ver e resgatar as recompensas de indicação.",
    faq_q11: "Quais carteiras são suportadas?",
    faq_a11: "Todas as carteiras compatíveis com TON Connect são suportadas, incluindo Tonkeeper, Telegram Wallet, MyTonWallet e outras carteiras TON suportadas.",
    faq_q12: "O smart contract foi auditado?",
    faq_a12: "O smart contract é open-source e está disponível para revisão pública. O status da auditoria será anunciado separadamente.",
    faq_q13: "Posso vender ou transferir MAGT durante a pré-venda?",
    faq_a13: "Não. Os tokens MAGT não podem ser transferidos ou negociados até depois da pré-venda e do listing oficial.",
    faq_q14: "O que acontece se uma transação falhar?",
    faq_a14: "Se uma transação falhar ou for parcialmente preenchida, o TON não utilizado é reembolsado automaticamente e os saldos resgatáveis são restaurados com segurança on-chain.",
    faq_q15: "Meu investimento é seguro?",
    faq_a15: "Toda a lógica da pré-venda é tratada por smart contracts on-chain. Não há intervenção manual, carteiras custodiadas ou saldos off-chain.\n\nNo entanto, como qualquer investimento em cripto, participar envolve risco.",
    faq_q16: "Onde posso acompanhar as atualizações do projeto?",
    faq_a16: "Anúncios e atualizações oficiais serão publicados no site, nos canais sociais e nas plataformas da comunidade.",
  },

  // ⏳ тимчасово EN
  cn: {
    app__your_magt: "你的 MAGT",
    app__claim: "领取",
    presale_progress__total_presale: "预售总计",

    ...EN,
    faq_q1: "什么是 MAGIC TIME？",
    faq_a1: "MAGIC TIME 是一个基于 TON 的区块链项目，致力于构建可扩展的生态系统，让“时间机制”与去中心化金融相结合。预售让早期支持者在公开上市前获得 MAGT 代币。\n\nMagicTime 是一个创新的加密项目，在这里时间成为数字资产。每个 MagicTime 代币代表一段时间碎片，可以投资、交换，并在独特的生态中使用。平台将区块链技术与“魔法般”的用户体验结合，让参与者能够“掌控时间”，并将其转化为真实价值。加入 MagicTime，打造一个每一秒都重要的未来。",
    faq_q2: "什么是 MAGT？",
    faq_a2: "MAGT 是 MAGIC TIME 生态的原生实用型代币，用于生态访问、奖励、未来产品以及治理相关功能。",
    faq_q3: "使用什么网络？",
    faq_a3: "MAGIC TIME 构建在 The Open Network (TON) 之上，确保交易快速、手续费低，并与钱包无缝集成。",
    faq_q4: "预售如何运作？",
    faq_a4: "参与者向预售智能合约发送 TON。购买的代币会在链上记录，并可通过 Claim 功能进行领取。",
    faq_q5: "购买后会立即收到代币吗？",
    faq_a5: "不会。代币不会立即转账。它们会变为可领取状态，你可以稍后通过 Claim 按钮提取。\n\n这种方式更安全，并能避免发送失败。",
    faq_q6: "我什么时候可以领取代币？",
    faq_a6: "当预售合约开启领取（claim）后即可领取。一旦启用，你可以随时通过 Claim 按钮提取可用的 MAGT。",
    faq_q7: "是否有解锁/锁仓（vesting/lockup）？",
    faq_a7: "有。预售代币将遵循解锁与锁仓计划，该计划会在公开上市前公布，以确保项目长期稳定。",
    faq_q8: "预售分配了多少代币？",
    faq_a8: "本轮预售分配总供应量的 5%。未售出的代币将保留用于未来生态发展与项目。",
    faq_q9: "是否有邀请/推荐计划？",
    faq_a9: "有。你可以分享你的推荐链接来获得额外的 MAGT。推荐奖励会累积，并可通过同样的 Claim 机制领取。",
    faq_q10: "谁可以看到推荐奖励？",
    faq_a10: "只有推荐人（分享推荐链接的钱包）可以看到并领取推荐奖励。",
    faq_q11: "支持哪些钱包？",
    faq_a11: "支持所有兼容 TON Connect 的钱包，包括 Tonkeeper、Telegram Wallet、MyTonWallet 以及其他支持的 TON 钱包。",
    faq_q12: "智能合约是否经过审计？",
    faq_a12: "智能合约是开源的，可供公众审查。审计状态将另行公布。",
    faq_q13: "预售期间我可以出售或转账 MAGT 吗？",
    faq_a13: "不可以。在预售结束并正式上市之前，MAGT 代币无法转账或交易。",
    faq_q14: "如果交易失败会怎样？",
    faq_a14: "如果交易失败或仅部分成交，未使用的 TON 会自动退款，可领取余额会在链上安全恢复。",
    faq_q15: "我的投资安全吗？",
    faq_a15: "所有预售逻辑均由链上智能合约执行。没有人工干预、没有托管钱包、也没有链下余额。\n\n但和任何加密投资一样，参与仍然存在风险。",
    faq_q16: "在哪里关注项目更新？",
    faq_a16: "官方公告与更新将通过官网、社交渠道以及社区平台发布。",
  },
  in: {
    app__your_magt: "आपका MAGT",
    app__claim: "क्लेम करें",
    presale_progress__total_presale: "कुल प्रीसेल",

    ...EN,
    faq_q1: "MAGIC TIME क्या है?",
    faq_a1: "MAGIC TIME एक TON‑आधारित ब्लॉकचेन प्रोजेक्ट है, जिसका लक्ष्य एक स्केलेबल इकोसिस्टम बनाना है जहाँ समय‑आधारित मैकेनिक्स और विकेंद्रीकृत वित्त (DeFi) मिलते हैं। प्रीसैल शुरुआती समर्थकों को सार्वजनिक लिस्टिंग से पहले MAGT टोकन हासिल करने का मौका देती है।\n\nMagicTime एक नवोन्मेषी क्रिप्टो प्रोजेक्ट है जहाँ समय एक डिजिटल एसेट बन जाता है। प्रत्येक MagicTime टोकन समय के एक हिस्से का प्रतिनिधित्व करता है जिसे निवेश, एक्सचेंज और एक अनोखे इकोसिस्टम में उपयोग किया जा सकता है। यह प्लेटफ़ॉर्म ब्लॉकचेन तकनीक को “मैजिकल” यूज़र एक्सपीरियंस के साथ जोड़ता है, जिससे प्रतिभागी “समय को नियंत्रित” कर सकते हैं और उसे वास्तविक मूल्य में बदल सकते हैं। MagicTime में जुड़िए और ऐसा भविष्य बनाइए जहाँ हर सेकंड मायने रखता है।",
    faq_q2: "MAGT क्या है?",
    faq_a2: "MAGT, MAGIC TIME इकोसिस्टम का मूल utility टोकन है। इसका उपयोग इकोसिस्टम एक्सेस, रिवॉर्ड्स, भविष्य के प्रोडक्ट्स और गवर्नेंस फीचर्स के लिए होता है।",
    faq_q3: "कौन‑सा नेटवर्क उपयोग होता है?",
    faq_a3: "MAGIC TIME, The Open Network (TON) पर बनाया गया है, जो तेज़ ट्रांज़ैक्शन, कम फीस और आसान वॉलेट इंटीग्रेशन सुनिश्चित करता है।",
    faq_q4: "प्रीसैल कैसे काम करती है?",
    faq_a4: "प्रतिभागी प्रीसैल स्मार्ट कॉन्ट्रैक्ट पर TON भेजते हैं। खरीदे गए टोकन ऑन‑चेन रिकॉर्ड होते हैं और Claim फ़ंक्शन के ज़रिए क्लेम किए जा सकते हैं।",
    faq_q5: "क्या खरीदने के तुरंत बाद मुझे टोकन मिल जाते हैं?",
    faq_a5: "नहीं। टोकन तुरंत ट्रांसफर नहीं होते। इसके बजाय वे क्लेमेबल हो जाते हैं और आप बाद में Claim बटन से उन्हें निकाल सकते हैं।\n\nयह तरीका सुरक्षा बढ़ाता है और फेल्ड डिलीवरी से बचाता है।",
    faq_q6: "मैं अपने टोकन कब क्लेम कर सकता/सकती हूँ?",
    faq_a6: "टोकन तब क्लेम किए जा सकते हैं जब प्रीसैल कॉन्ट्रैक्ट क्लेम की अनुमति देता है। एक बार सक्षम होने पर, आप किसी भी समय Claim बटन से उपलब्ध MAGT निकाल सकते हैं।",
    faq_q7: "क्या vesting या lockup है?",
    faq_a7: "हाँ। प्रीसैल टोकन पर vesting और lockup शेड्यूल लागू होगा, जिसे सार्वजनिक लिस्टिंग से पहले प्रकाशित किया जाएगा ताकि प्रोजेक्ट की दीर्घकालिक स्थिरता बनी रहे।",
    faq_q8: "प्रीसैल के लिए कितने प्रतिशत टोकन आवंटित हैं?",
    faq_a8: "कुल टोकन सप्लाई का 5% इस प्रीसैल राउंड के लिए आवंटित है। जो टोकन नहीं बिकेंगे, उन्हें भविष्य के इकोसिस्टम डेवलपमेंट और प्रोजेक्ट्स के लिए रिज़र्व किया जाएगा।",
    faq_q9: "क्या रेफरल प्रोग्राम है?",
    faq_a9: "हाँ। आप अपना रेफरल लिंक शेयर करके अतिरिक्त MAGT कमा सकते हैं। रेफरल रिवॉर्ड्स जमा होते हैं और उसी Claim मैकेनिज़्म से निकाले जा सकते हैं।",
    faq_q10: "रेफरल रिवॉर्ड्स कौन देख सकता है?",
    faq_a10: "केवल रेफरल ओनर (वह वॉलेट जिसने रेफरल लिंक शेयर किया) ही रेफरल रिवॉर्ड्स देख और क्लेम कर सकता है।",
    faq_q11: "कौन‑से वॉलेट सपोर्टेड हैं?",
    faq_a11: "सभी TON Connect‑compatible वॉलेट सपोर्टेड हैं, जैसे Tonkeeper, Telegram Wallet, MyTonWallet और अन्य TON वॉलेट।",
    faq_q12: "क्या स्मार्ट कॉन्ट्रैक्ट ऑडिटेड है?",
    faq_a12: "स्मार्ट कॉन्ट्रैक्ट ओपन‑सोर्स है और सार्वजनिक समीक्षा के लिए उपलब्ध है। ऑडिट स्टेटस अलग से घोषित किया जाएगा।",
    faq_q13: "क्या मैं प्रीसैल के दौरान MAGT बेच या ट्रांसफर कर सकता हूँ?",
    faq_a13: "नहीं। प्रीसैल और आधिकारिक लिस्टिंग के बाद ही MAGT टोकन को ट्रांसफर या ट्रेड किया जा सकेगा।",
    faq_q14: "अगर ट्रांज़ैक्शन फेल हो जाए तो क्या होता है?",
    faq_a14: "यदि ट्रांज़ैक्शन फेल हो जाता है या आंशिक रूप से पूरा होता है, तो अप्रयुक्त TON अपने आप रिफंड हो जाता है और क्लेमेबल बैलेंस ऑन‑चेन सुरक्षित रूप से बहाल हो जाते हैं।",
    faq_q15: "क्या मेरा निवेश सुरक्षित है?",
    faq_a15: "सारी प्रीसैल लॉजिक ऑन‑चेन स्मार्ट कॉन्ट्रैक्ट्स द्वारा संचालित है। कोई मैनुअल इंटरवेंशन नहीं, कोई कस्टोडियल वॉलेट नहीं, और कोई ऑफ‑चेन बैलेंस नहीं।\n\nफिर भी, किसी भी क्रिप्टो निवेश की तरह, भागीदारी में जोखिम होता है।",
    faq_q16: "मैं प्रोजेक्ट अपडेट्स कहाँ फॉलो कर सकता/सकती हूँ?",
    faq_a16: "आधिकारिक घोषणाएँ और अपडेट्स वेबसाइट, सोशल चैनल्स और कम्युनिटी प्लेटफ़ॉर्म्स के माध्यम से प्रकाशित किए जाएंगे।",
  },
  id: {
    app__your_magt: "MAGT Anda",
    app__claim: "Klaim",
    presale_progress__total_presale: "Total presale",

    ...EN,
    faq_q1: "Apa itu MAGIC TIME?",
    faq_a1: "MAGIC TIME adalah proyek blockchain berbasis TON yang berfokus membangun ekosistem yang skalabel, tempat mekanisme berbasis waktu bertemu dengan keuangan terdesentralisasi. Presale memungkinkan pendukung awal memperoleh token MAGT sebelum listing publik.\n\nMagicTime adalah proyek kripto inovatif di mana waktu menjadi aset digital. Setiap token MagicTime merepresentasikan fragmen waktu yang dapat diinvestasikan, dipertukarkan, dan digunakan dalam ekosistem yang unik. Platform ini menggabungkan teknologi blockchain dengan pengalaman pengguna yang “magis”, memungkinkan peserta untuk “mengendalikan waktu” dan mengubahnya menjadi nilai nyata. Selami MagicTime dan bangun masa depan di mana setiap detik berarti.",
    faq_q2: "Apa itu MAGT?",
    faq_a2: "MAGT adalah token utilitas native dari ekosistem MAGIC TIME. Token ini digunakan untuk akses ekosistem, reward, produk masa depan, dan fitur tata kelola.",
    faq_q3: "Jaringan apa yang digunakan?",
    faq_a3: "MAGIC TIME dibangun di The Open Network (TON), memastikan transaksi cepat, biaya rendah, dan integrasi dompet yang mulus.",
    faq_q4: "Bagaimana presale bekerja?",
    faq_a4: "Peserta mengirim TON ke smart contract presale. Token yang dibeli dicatat on-chain dan menjadi dapat diklaim melalui fungsi Claim.",
    faq_q5: "Apakah saya menerima token segera setelah membeli?",
    faq_a5: "Tidak. Token tidak ditransfer secara instan. Sebagai gantinya, token menjadi dapat diklaim, dan Anda dapat menariknya nanti menggunakan tombol Claim.\n\nPendekatan ini meningkatkan keamanan dan mencegah pengiriman yang gagal.",
    faq_q6: "Kapan saya bisa mengklaim token saya?",
    faq_a6: "Token dapat diklaim setelah kontrak presale mengizinkan klaim. Setelah diaktifkan, Anda dapat menarik MAGT yang tersedia kapan saja menggunakan tombol Claim.",
    faq_q7: "Apakah ada vesting atau lockup?",
    faq_a7: "Ya. Token presale tunduk pada jadwal vesting dan lockup, yang akan dipublikasikan sebelum listing publik untuk memastikan stabilitas jangka panjang proyek.",
    faq_q8: "Berapa persen token yang dialokasikan untuk presale?",
    faq_a8: "5% dari total suplai token dialokasikan untuk ronde presale ini. Token yang tidak terjual akan disimpan untuk pengembangan ekosistem dan proyek di masa depan.",
    faq_q9: "Apakah ada program referral?",
    faq_a9: "Ya. Anda dapat memperoleh token MAGT tambahan dengan membagikan tautan referral Anda. Reward referral terakumulasi dan dapat ditarik menggunakan mekanisme Claim yang sama.",
    faq_q10: "Siapa yang dapat melihat reward referral?",
    faq_a10: "Hanya pemilik referral (dompet yang membagikan tautan referral) yang dapat melihat dan mengklaim reward referral.",
    faq_q11: "Dompet apa saja yang didukung?",
    faq_a11: "Semua dompet yang kompatibel dengan TON Connect didukung, termasuk Tonkeeper, Telegram Wallet, MyTonWallet, dan dompet TON lainnya yang didukung.",
    faq_q12: "Apakah smart contract diaudit?",
    faq_a12: "Smart contract bersifat open-source dan tersedia untuk ditinjau publik. Status audit akan diumumkan terpisah.",
    faq_q13: "Bisakah saya menjual atau mentransfer MAGT selama presale?",
    faq_a13: "Tidak. Token MAGT tidak dapat ditransfer atau diperdagangkan sampai setelah presale dan listing resmi.",
    faq_q14: "Apa yang terjadi jika transaksi gagal?",
    faq_a14: "Jika transaksi gagal atau hanya terisi sebagian, TON yang tidak terpakai akan otomatis dikembalikan dan saldo yang dapat diklaim dipulihkan dengan aman on-chain.",
    faq_q15: "Apakah investasi saya aman?",
    faq_a15: "Seluruh logika presale ditangani oleh smart contract on-chain. Tidak ada intervensi manual, tidak ada dompet kustodian, dan tidak ada saldo off-chain.\n\nNamun, seperti investasi kripto lainnya, partisipasi tetap memiliki risiko.",
    faq_q16: "Di mana saya bisa mengikuti pembaruan proyek?",
    faq_a16: "Pengumuman dan pembaruan resmi akan dipublikasikan melalui situs web, kanal sosial, dan platform komunitas.",
  },
  sa: {
    app__your_magt: "MAGT الخاص بك",
    app__claim: "استلام",
    presale_progress__total_presale: "إجمالي البيع المسبق",

    ...EN,
    faq_q1: "ما هو MAGIC TIME؟",
    faq_a1: "MAGIC TIME هو مشروع بلوكشين مبني على TON يركّز على بناء نظام بيئي قابل للتوسع حيث تلتقي آليات الوقت مع التمويل اللامركزي. يتيح البيع المسبق للمؤيدين الأوائل الحصول على رموز MAGT قبل الإدراج العام.\n\nMagicTime هو مشروع كريبتو مبتكر يصبح فيه الوقت أصلًا رقميًا. يمثّل كل رمز MagicTime جزءًا من الوقت يمكن استثماره وتبادله واستخدامه داخل نظام بيئي فريد. تجمع المنصة بين تقنية البلوكشين وتجربة مستخدم «سحرية»، مما يسمح للمشاركين بـ«التحكم بالوقت» وتحويله إلى قيمة حقيقية. انضم إلى MagicTime وابنِ مستقبلًا تكون فيه كل ثانية مهمة.",
    faq_q2: "ما هو MAGT؟",
    faq_a2: "MAGT هو رمز المنفعة الأصلي لنظام MAGIC TIME. يُستخدم للوصول إلى النظام البيئي، والمكافآت، والمنتجات المستقبلية، وميزات الحوكمة.",
    faq_q3: "ما هي الشبكة المستخدمة؟",
    faq_a3: "MAGIC TIME مبني على The Open Network (TON)، ما يضمن معاملات سريعة ورسومًا منخفضة وتكاملاً سلسًا مع المحافظ.",
    faq_q4: "كيف يعمل البيع المسبق؟",
    faq_a4: "يرسل المشاركون TON إلى عقد البيع المسبق الذكي. تُسجَّل الرموز المشتراة على السلسلة وتصبح قابلة للمطالبة عبر وظيفة Claim.",
    faq_q5: "هل أتلقى الرموز فورًا بعد الشراء؟",
    faq_a5: "لا. لا يتم نقل الرموز فورًا. بدلاً من ذلك تصبح قابلة للمطالبة، ويمكنك سحبها لاحقًا باستخدام زر Claim.\n\nهذا النهج يعزّز الأمان ويمنع فشل عمليات التسليم.",
    faq_q6: "متى يمكنني المطالبة برموزي؟",
    faq_a6: "يمكن المطالبة بالرموز بعد أن يسمح عقد البيع المسبق بالمطالبة. بعد التفعيل يمكنك سحب MAGT المتاحة في أي وقت باستخدام زر Claim.",
    faq_q7: "هل يوجد استحقاق (Vesting) أو قفل (Lockup)؟",
    faq_a7: "نعم. تخضع رموز البيع المسبق لجدول استحقاق وقفل سيتم نشره قبل الإدراج العام لضمان استقرار المشروع على المدى الطويل.",
    faq_q8: "ما نسبة الرموز المخصصة للبيع المسبق؟",
    faq_a8: "تم تخصيص 5٪ من إجمالي المعروض من الرموز لهذه الجولة من البيع المسبق. سيتم الاحتفاظ بالرموز غير المباعة لتطوير النظام البيئي والمشاريع المستقبلية.",
    faq_q9: "هل يوجد برنامج إحالة؟",
    faq_a9: "نعم. يمكنك كسب رموز MAGT إضافية عبر مشاركة رابط الإحالة الخاص بك. تتراكم مكافآت الإحالة ويمكن سحبها عبر آلية Claim نفسها.",
    faq_q10: "من يمكنه رؤية مكافآت الإحالة؟",
    faq_a10: "فقط مالك الإحالة (المحفظة التي شاركت رابط الإحالة) يمكنه رؤية مكافآت الإحالة والمطالبة بها.",
    faq_q11: "ما المحافظ المدعومة؟",
    faq_a11: "يتم دعم جميع المحافظ المتوافقة مع TON Connect، بما في ذلك Tonkeeper وTelegram Wallet وMyTonWallet ومحافظ TON الأخرى المدعومة.",
    faq_q12: "هل تم تدقيق العقد الذكي؟",
    faq_a12: "العقد الذكي مفتوح المصدر ومتاح للمراجعة العامة. سيتم الإعلان عن حالة التدقيق بشكل منفصل.",
    faq_q13: "هل يمكنني بيع أو تحويل MAGT أثناء البيع المسبق؟",
    faq_a13: "لا. لا يمكن تحويل أو تداول رموز MAGT حتى بعد انتهاء البيع المسبق والإدراج الرسمي.",
    faq_q14: "ماذا يحدث إذا فشلت المعاملة؟",
    faq_a14: "إذا فشلت المعاملة أو تم تنفيذها جزئيًا، يتم رد TON غير المستخدم تلقائيًا وتتم استعادة الأرصدة القابلة للمطالبة بأمان على السلسلة.",
    faq_q15: "هل استثماري آمن؟",
    faq_a15: "يتم تنفيذ منطق البيع المسبق بالكامل بواسطة عقود ذكية على السلسلة. لا يوجد تدخل يدوي ولا محافظ وصاية ولا أرصدة خارج السلسلة.\n\nومع ذلك، مثل أي استثمار في الكريبتو، فإن المشاركة تنطوي على مخاطر.",
    faq_q16: "أين يمكنني متابعة تحديثات المشروع؟",
    faq_a16: "سيتم نشر الإعلانات والتحديثات الرسمية عبر الموقع الإلكتروني وقنوات التواصل الاجتماعي ومنصات المجتمع.",
  },
  bd: {
    app__your_magt: "আপনার MAGT",
    app__claim: "ক্লেইম করুন",
    presale_progress__total_presale: "মোট প্রিসেল",

    ...EN,
    faq_q1: "MAGIC TIME কী?",
    faq_a1: "MAGIC TIME হলো TON‑ভিত্তিক একটি ব্লকচেইন প্রকল্প, যার লক্ষ্য একটি স্কেলেবল ইকোসিস্টেম তৈরি করা যেখানে সময়ভিত্তিক মেকানিক্স এবং বিকেন্দ্রীকৃত অর্থায়ন (DeFi) একত্র হয়। প্রিসেল প্রাথমিক সমর্থকদের পাবলিক লিস্টিংয়ের আগে MAGT টোকেন অর্জনের সুযোগ দেয়।\n\nMagicTime একটি উদ্ভাবনী ক্রিপ্টো প্রকল্প যেখানে সময় একটি ডিজিটাল সম্পদে পরিণত হয়। প্রতিটি MagicTime টোকেন সময়ের একটি অংশকে প্রতিনিধিত্ব করে যা বিনিয়োগ, বিনিময় এবং একটি অনন্য ইকোসিস্টেমে ব্যবহার করা যায়। প্ল্যাটফর্মটি ব্লকচেইন প্রযুক্তির সাথে একটি “ম্যাজিক্যাল” ব্যবহারকারীর অভিজ্ঞতা যুক্ত করে, অংশগ্রহণকারীদের “সময় নিয়ন্ত্রণ” করতে এবং তা বাস্তব মূল্যে রূপান্তর করতে সক্ষম করে। MagicTime‑এ ডুব দিন এবং এমন একটি ভবিষ্যৎ গড়ুন যেখানে প্রতিটি সেকেন্ড গুরুত্বপূর্ণ।",
    faq_q2: "MAGT কী?",
    faq_a2: "MAGT হলো MAGIC TIME ইকোসিস্টেমের নেটিভ ইউটিলিটি টোকেন। এটি ইকোসিস্টেম অ্যাক্সেস, রিওয়ার্ড, ভবিষ্যৎ পণ্য এবং গভর্ন্যান্স ফিচারের জন্য ব্যবহৃত হয়।",
    faq_q3: "কোন নেটওয়ার্ক ব্যবহার করা হয়?",
    faq_a3: "MAGIC TIME নির্মিত The Open Network (TON)‑এ, যা দ্রুত লেনদেন, কম ফি এবং সহজ ওয়ালেট ইন্টিগ্রেশন নিশ্চিত করে।",
    faq_q4: "প্রিসেল কীভাবে কাজ করে?",
    faq_a4: "অংশগ্রহণকারীরা প্রিসেল স্মার্ট কন্ট্র্যাক্টে TON পাঠায়। কেনা টোকেন অন‑চেইনে রেকর্ড হয় এবং Claim ফাংশনের মাধ্যমে ক্লেমযোগ্য হয়।",
    faq_q5: "কেনার সাথে সাথে কি আমি টোকেন পাই?",
    faq_a5: "না। টোকেন তাৎক্ষণিকভাবে ট্রান্সফার হয় না। বরং সেগুলো ক্লেমযোগ্য হয় এবং আপনি পরে Claim বাটন ব্যবহার করে তুলে নিতে পারেন।\n\nএই পদ্ধতি নিরাপত্তা বাড়ায় এবং ব্যর্থ ডেলিভারি রোধ করে।",
    faq_q6: "আমি কখন আমার টোকেন ক্লেম করতে পারব?",
    faq_a6: "প্রিসেল কন্ট্র্যাক্ট যখন ক্লেম অনুমোদন করবে তখন টোকেন ক্লেম করা যাবে। একবার সক্রিয় হলে, আপনি যেকোনো সময় Claim বাটন দিয়ে আপনার উপলব্ধ MAGT তুলে নিতে পারেন।",
    faq_q7: "ভেস্টিং বা লকআপ আছে কি?",
    faq_a7: "হ্যাঁ। প্রিসেল টোকেন ভেস্টিং ও লকআপ শিডিউলের অধীনে থাকবে, যা পাবলিক লিস্টিংয়ের আগে প্রকাশ করা হবে যাতে প্রকল্পের দীর্ঘমেয়াদি স্থিতিশীলতা নিশ্চিত হয়।",
    faq_q8: "প্রিসেলের জন্য কত শতাংশ টোকেন বরাদ্দ?",
    faq_a8: "মোট টোকেন সাপ্লাইয়ের 5% এই প্রিসেল রাউন্ডের জন্য বরাদ্দ। অবিক্রীত টোকেন ভবিষ্যৎ ইকোসিস্টেম ডেভেলপমেন্ট ও প্রকল্পের জন্য সংরক্ষিত থাকবে।",
    faq_q9: "রেফারাল প্রোগ্রাম আছে কি?",
    faq_a9: "হ্যাঁ। আপনি আপনার রেফারাল লিংক শেয়ার করে অতিরিক্ত MAGT উপার্জন করতে পারেন। রেফারাল রিওয়ার্ড জমা হয় এবং একই Claim মেকানিজম দিয়ে তুলে নেওয়া যায়।",
    faq_q10: "কে রেফারাল রিওয়ার্ড দেখতে পারে?",
    faq_a10: "শুধু রেফারাল ওনার (যে ওয়ালেট রেফারাল লিংক শেয়ার করেছে) রেফারাল রিওয়ার্ড দেখতে ও ক্লেম করতে পারে।",
    faq_q11: "কোন কোন ওয়ালেট সাপোর্টেড?",
    faq_a11: "TON Connect‑compatible সব ওয়ালেট সাপোর্টেড, যেমন Tonkeeper, Telegram Wallet, MyTonWallet এবং অন্যান্য সাপোর্টেড TON ওয়ালেট।",
    faq_q12: "স্মার্ট কন্ট্র্যাক্ট কি অডিটেড?",
    faq_a12: "স্মার্ট কন্ট্র্যাক্টটি ওপেন‑সোর্স এবং জনসমক্ষে পর্যালোচনার জন্য উপলব্ধ। অডিট স্ট্যাটাস আলাদাভাবে ঘোষণা করা হবে।",
    faq_q13: "প্রিসেলের সময় কি আমি MAGT বিক্রি বা ট্রান্সফার করতে পারি?",
    faq_a13: "না। প্রিসেল ও অফিসিয়াল লিস্টিং শেষ না হওয়া পর্যন্ত MAGT টোকেন ট্রান্সফার বা ট্রেড করা যাবে না।",
    faq_q14: "ট্রান্স্যাকশন ব্যর্থ হলে কী হয়?",
    faq_a14: "ট্রান্স্যাকশন ব্যর্থ হলে বা আংশিকভাবে পূরণ হলে, অব্যবহৃত TON স্বয়ংক্রিয়ভাবে ফেরত দেওয়া হয় এবং ক্লেমযোগ্য ব্যালেন্স অন‑চেইনে নিরাপদে পুনরুদ্ধার হয়।",
    faq_q15: "আমার বিনিয়োগ কি নিরাপদ?",
    faq_a15: "সব প্রিসেল লজিক অন‑চেইন স্মার্ট কন্ট্র্যাক্ট দ্বারা পরিচালিত হয়। কোনো ম্যানুয়াল হস্তক্ষেপ নেই, কোনো কাস্টডিয়াল ওয়ালেট নেই, এবং কোনো অফ‑চেইন ব্যালেন্স নেই।\n\nতবে যেকোনো ক্রিপ্টো বিনিয়োগের মতোই, অংশগ্রহণে ঝুঁকি রয়েছে।",
    faq_q16: "আমি কোথায় প্রোজেক্ট আপডেট ফলো করতে পারি?",
    faq_a16: "অফিসিয়াল ঘোষণা ও আপডেট ওয়েবসাইট, সোশ্যাল চ্যানেল এবং কমিউনিটি প্ল্যাটফর্মের মাধ্যমে প্রকাশ করা হবে।",
  },
};



/* ====== LONG CONTENT (FAQ + LEGAL DOCS) ====== */

export const FAQ_ITEMS: Record<LangCode, { q: string; a: string }[]> = {
  en: [
    { q: `What is MAGIC TIME?`, a: `MAGIC TIME is a TON-based blockchain project focused on building a scalable ecosystem where time-based mechanics meet decentralized finance. The presale allows early supporters to acquire MAGT tokens before public listing.
MagicTime is an innovative crypto project where time becomes a digital asset. Each MagicTime token represents a fragment of time that can be invested, exchanged, and used within a unique ecosystem. The platform combines blockchain technology with a magical user experience, allowing participants to “control time” and convert it into real value. Dive into MagicTime and build a future where every second matters.` },
    { q: `What is MAGT?`, a: `MAGT is the native utility token of the MAGIC TIME ecosystem. It is used for ecosystem access, rewards, future products, and governance features.` },
    { q: `What network is used?`, a: `MAGIC TIME is built on The Open Network (TON), ensuring fast transactions, low fees, and seamless wallet integration.` },
    { q: `How does the presale work?`, a: `Participants send TON to the presale smart contract. Purchased tokens are recorded on-chain and become claimable via the Claim function.` },
    { q: `Do I receive tokens immediately after purchase?`, a: `No. Tokens are not transferred instantly. Instead, they become claimable, and you can withdraw them later using the Claim button.
This approach increases security and prevents failed deliveries.` },
    { q: `When can I claim my tokens?`, a: `Tokens can be claimed after the presale contract allows claiming. Once enabled, you can withdraw your available MAGT at any time using the Claim button.` },
    { q: `Is there a vesting or lockup?`, a: `Yes. Presale tokens are subject to a vesting and lockup schedule, which will be published before public listing to ensure long-term project stability.` },
    { q: `What percentage of tokens is allocated to presale?`, a: `5% of the total token supply is allocated to this presale round. Unsold tokens will be reserved for future ecosystem development and projects.` },
    { q: `Is there a referral program?`, a: `Yes. You can earn additional MAGT tokens by sharing your referral link. Referral rewards are accumulated and can be withdrawn using the same Claim mechanism.` },
    { q: `Who can see referral rewards?`, a: `Only the referral owner (the wallet that shared the referral link) can see and claim referral rewards.` },
    { q: `Which wallets are supported?`, a: `All TON Connect–compatible wallets are supported, including Tonkeeper, Telegram Wallet, MyTonWallet, and other supported TON wallets.` },
    { q: `Is the smart contract audited?`, a: `The smart contract is open-source and available for public review. Audit status will be announced separately.` },
    { q: `Can I sell or transfer MAGT during presale?`, a: `No. MAGT tokens cannot be transferred or traded until after the presale and official listing.` },
    { q: `What happens if a transaction fails?`, a: `If a transaction fails or is partially filled, unused TON is automatically refunded and claimable balances are safely restored on-chain.` },
    { q: `Is my investment safe?`, a: `All presale logic is handled by on-chain smart contracts. There is no manual intervention, no custodial wallets, and no off-chain balances.
However, like any crypto investment, participation carries risk.` },
    { q: `Where can I follow project updates?`, a: `Official announcements and updates will be published through the website, social channels, and community platforms.` },
  ],
  uk: [
    { q: `Що таке MAGIC TIME?`, a: `MAGIC TIME — це блокчейн‑проєкт на TON, орієнтований на побудову масштабованої екосистеми, де механіки, пов’язані з часом, поєднуються з децентралізованими фінансами. Пресейл дозволяє раннім прихильникам отримати токени MAGT до публічного лістингу.
MagicTime — інноваційний криптопроєкт, де час стає цифровим активом. Кожен токен MagicTime — це фрагмент часу, який можна інвестувати, обмінювати та використовувати в унікальній екосистемі. Платформа поєднує блокчейн‑технології з «магічним» користувацьким досвідом, дозволяючи учасникам «керувати часом» і перетворювати його на реальну цінність. Поринь у MagicTime та будуй майбутнє, де кожна секунда має значення.` },
    { q: `Що таке MAGT?`, a: `MAGT — нативний утилітарний токен екосистеми MAGIC TIME. Він використовується для доступу до екосистеми, винагород, майбутніх продуктів і функцій управління (governance).` },
    { q: `Яка мережа використовується?`, a: `MAGIC TIME побудований на The Open Network (TON), що забезпечує швидкі транзакції, низькі комісії та зручну інтеграцію з гаманцями.` },
    { q: `Як працює пресейл?`, a: `Учасники надсилають TON на смарт‑контракт пресейлу. Куплені токени фіксуються ончейн і стають доступними до отримання через функцію Claim.` },
    { q: `Чи отримую я токени одразу після покупки?`, a: `Ні. Токени не надсилаються миттєво. Замість цього вони стають «claimable», і ти зможеш вивести їх пізніше кнопкою Claim.
Такий підхід підвищує безпеку та запобігає невдалим доставкам.` },
    { q: `Коли я можу отримати свої токени?`, a: `Токени можна отримати після того, як контракт пресейлу увімкне можливість Claim. Після активації ти зможеш виводити доступні MAGT у будь‑який час кнопкою Claim.` },
    { q: `Чи є вестинг або локап?`, a: `Так. Токени пресейлу підпадають під графік вестингу та блокування, який буде опубліковано до публічного лістингу для довгострокової стабільності проєкту.` },
    { q: `Який відсоток токенів виділено на пресейл?`, a: `5% від загальної емісії токенів виділено на цей раунд пресейлу. Непродані токени будуть зарезервовані для розвитку екосистеми та майбутніх проєктів.` },
    { q: `Чи є реферальна програма?`, a: `Так. Ти можеш заробляти додаткові MAGT, поширюючи свій реферальний лінк. Реферальні винагороди накопичуються та виводяться тим самим механізмом Claim.` },
    { q: `Хто може бачити реферальні винагороди?`, a: `Лише власник реферала (гаманець, який поширив реферальний лінк) може бачити й отримувати реферальні винагороди.` },
    { q: `Які гаманці підтримуються?`, a: `Підтримуються всі гаманці, сумісні з TON Connect, зокрема Tonkeeper, Telegram Wallet, MyTonWallet та інші TON‑гаманці.` },
    { q: `Чи проходив смарт‑контракт аудит?`, a: `Смарт‑контракт є open‑source і доступний для публічного перегляду. Статус аудиту буде оголошено окремо.` },
    { q: `Чи можу я продати або переказати MAGT під час пресейлу?`, a: `Ні. Токени MAGT не можна переказувати чи торгувати ними до завершення пресейлу та офіційного лістингу.` },
    { q: `Що станеться, якщо транзакція не пройде?`, a: `Якщо транзакція не пройде або буде виконана частково, невикористані TON автоматично повертаються, а «claimable» баланси безпечно відновлюються ончейн.` },
    { q: `Чи безпечна моя участь?`, a: `Уся логіка пресейлу виконується ончейн смарт‑контрактами. Немає ручного втручання, кастодіальних гаманців і офчейн балансів.
Однак, як і будь‑яка криптоінвестиція, участь пов’язана з ризиком.` },
    { q: `Де стежити за оновленнями проєкту?`, a: `Офіційні анонси та оновлення публікуватимуться на сайті, у соцмережах та на спільнотних платформах.` },
  ],
  ru: [
    { q: `Что такое MAGIC TIME?`, a: `MAGIC TIME — блокчейн‑проект на TON, направленный на создание масштабируемой экосистемы, где механики, связанные со временем, встречаются с децентрализованными финансами. Пресейл позволяет ранним сторонникам приобрести токены MAGT до публичного листинга.
MagicTime — инновационный криптопроект, где время становится цифровым активом. Каждый токен MagicTime представляет собой фрагмент времени, который можно инвестировать, обменивать и использовать в уникальной экосистеме. Платформа сочетает блокчейн‑технологии с «магическим» пользовательским опытом, позволяя участникам «управлять временем» и превращать его в реальную ценность. Погружайся в MagicTime и создавай будущее, где каждая секунда имеет значение!` },
    { q: `Что такое MAGT?`, a: `MAGT — нативный утилитарный токен экосистемы MAGIC TIME. Он используется для доступа к экосистеме, наград, будущих продуктов и функций управления (governance).` },
    { q: `Какая сеть используется?`, a: `MAGIC TIME построен на The Open Network (TON), обеспечивая быстрые транзакции, низкие комиссии и удобную интеграцию с кошельками.` },
    { q: `Как работает пресейл?`, a: `Участники отправляют TON на смарт‑контракт пресейла. Купленные токены фиксируются ончейн и становятся доступными к получению через функцию Claim.` },
    { q: `Получаю ли я токены сразу после покупки?`, a: `Нет. Токены не отправляются мгновенно. Вместо этого они становятся «claimable», и вы сможете вывести их позже через кнопку Claim.
Такой подход повышает безопасность и предотвращает неудачные доставки.` },
    { q: `Когда я могу получить свои токены?`, a: `Токены можно получить после того, как контракт пресейла включит возможность Claim. После активации вы сможете выводить доступные MAGT в любое время через кнопку Claim.` },
    { q: `Есть ли вестинг или локап?`, a: `Да. Токены пресейла подпадают под график вестинга и блокировки, который будет опубликован до публичного листинга для долгосрочной стабильности проекта.` },
    { q: `Какой процент токенов выделен на пресейл?`, a: `5% от общего предложения токенов выделено на этот раунд пресейла. Непроданные токены будут зарезервированы для развития экосистемы и будущих проектов.` },
    { q: `Есть ли реферальная программа?`, a: `Да. Вы можете получать дополнительные MAGT, делясь своей реферальной ссылкой. Реферальные награды накапливаются и выводятся тем же механизмом Claim.` },
    { q: `Кто может видеть реферальные награды?`, a: `Только владелец реферала (кошелек, который поделился реферальной ссылкой) может видеть и получать реферальные награды.` },
    { q: `Какие кошельки поддерживаются?`, a: `Поддерживаются все кошельки, совместимые с TON Connect, включая Tonkeeper, Telegram Wallet, MyTonWallet и другие TON‑кошельки.` },
    { q: `Проходил ли смарт‑контракт аудит?`, a: `Смарт‑контракт открыт (open‑source) и доступен для публичного просмотра. Статус аудита будет объявлен отдельно.` },
    { q: `Могу ли я продать или перевести MAGT во время пресейла?`, a: `Нет. Токены MAGT нельзя переводить или торговать ими до завершения пресейла и официального листинга.` },
    { q: `Что будет, если транзакция не пройдет?`, a: `Если транзакция не пройдет или будет выполнена частично, неиспользованные TON автоматически возвращаются, а «claimable» балансы безопасно восстанавливаются ончейн.` },
    { q: `Безопасно ли мое участие?`, a: `Вся логика пресейла выполняется ончейн смарт‑контрактами. Нет ручного вмешательства, кастодиальных кошельков и офчейн балансов.
Однако, как и любая криптоинвестиция, участие связано с риском.` },
    { q: `Где следить за обновлениями проекта?`, a: `Официальные анонсы и обновления будут публиковаться на сайте, в социальных сетях и на платформах сообщества.` },
  ],
  es: [
    { q: `¿Qué es MAGIC TIME?`, a: `MAGIC TIME es un proyecto blockchain basado en TON, centrado en construir un ecosistema escalable donde las mecánicas basadas en el tiempo se unen con las finanzas descentralizadas. La preventa permite a los primeros seguidores adquirir tokens MAGT antes del listado público.
MagicTime es un proyecto cripto innovador en el que el tiempo se convierte en un activo digital. Cada token MagicTime representa un fragmento de tiempo que puede invertirse, intercambiarse y usarse dentro de un ecosistema único. La plataforma combina tecnología blockchain con una experiencia de usuario “mágica”, permitiendo a los participantes “controlar el tiempo” y convertirlo en valor real. Sumérgete en MagicTime y construye un futuro donde cada segundo importa.` },
    { q: `¿Qué es MAGT?`, a: `MAGT es el token utilitario nativo del ecosistema MAGIC TIME. Se utiliza para el acceso al ecosistema, recompensas, productos futuros y funciones de gobernanza.` },
    { q: `¿Qué red se utiliza?`, a: `MAGIC TIME está construido en The Open Network (TON), lo que garantiza transacciones rápidas, comisiones bajas e integración fluida con billeteras.` },
    { q: `¿Cómo funciona la preventa?`, a: `Los participantes envían TON al contrato inteligente de la preventa. Los tokens comprados se registran en cadena y pasan a ser reclamables mediante la función Claim.` },
    { q: `¿Recibo los tokens inmediatamente después de la compra?`, a: `No. Los tokens no se transfieren al instante. En su lugar, se vuelven reclamables y puedes retirarlos más tarde usando el botón Claim.
Este enfoque aumenta la seguridad y evita entregas fallidas.` },
    { q: `¿Cuándo puedo reclamar mis tokens?`, a: `Puedes reclamar los tokens después de que el contrato de preventa habilite el Claim. Una vez activado, podrás retirar tus MAGT disponibles en cualquier momento usando el botón Claim.` },
    { q: `¿Hay vesting o bloqueo?`, a: `Sí. Los tokens de preventa están sujetos a un calendario de vesting y bloqueo, que se publicará antes del listado público para garantizar la estabilidad a largo plazo del proyecto.` },
    { q: `¿Qué porcentaje de tokens se asigna a la preventa?`, a: `El 5% del suministro total de tokens se asigna a esta ronda de preventa. Los tokens no vendidos se reservarán para el desarrollo del ecosistema y proyectos futuros.` },
    { q: `¿Hay un programa de referidos?`, a: `Sí. Puedes ganar tokens MAGT adicionales compartiendo tu enlace de referido. Las recompensas de referido se acumulan y pueden retirarse usando el mismo mecanismo de Claim.` },
    { q: `¿Quién puede ver las recompensas de referido?`, a: `Solo el propietario del referido (la billetera que compartió el enlace de referido) puede ver y reclamar las recompensas.` },
    { q: `¿Qué billeteras son compatibles?`, a: `Se admiten todas las billeteras compatibles con TON Connect, incluidas Tonkeeper, Telegram Wallet, MyTonWallet y otras billeteras TON compatibles.` },
    { q: `¿El contrato inteligente está auditado?`, a: `El contrato inteligente es de código abierto y está disponible para revisión pública. El estado de la auditoría se anunciará por separado.` },
    { q: `¿Puedo vender o transferir MAGT durante la preventa?`, a: `No. Los tokens MAGT no pueden transferirse ni negociarse hasta después de la preventa y el listado oficial.` },
    { q: `¿Qué pasa si una transacción falla?`, a: `Si una transacción falla o se ejecuta parcialmente, el TON no utilizado se reembolsa automáticamente y los saldos reclamables se restauran de forma segura en cadena.` },
    { q: `¿Es segura mi inversión?`, a: `Toda la lógica de la preventa está gestionada por contratos inteligentes en cadena. No hay intervención manual, ni billeteras custodiales, ni saldos fuera de cadena.
Sin embargo, como cualquier inversión cripto, la participación conlleva riesgo.` },
    { q: `¿Dónde puedo seguir las novedades del proyecto?`, a: `Los anuncios y actualizaciones oficiales se publicarán a través del sitio web, las redes sociales y las plataformas de la comunidad.` },
  ],
  fr: [
    { q: `Qu’est-ce que MAGIC TIME ?`, a: `MAGIC TIME est un projet blockchain basé sur TON, visant à construire un écosystème évolutif où des mécaniques liées au temps rencontrent la finance décentralisée. La prévente permet aux premiers soutiens d’acquérir des tokens MAGT avant le listing public.
MagicTime est un projet crypto innovant où le temps devient un actif numérique. Chaque token MagicTime représente un fragment de temps pouvant être investi, échangé et utilisé dans un écosystème unique. La plateforme combine la technologie blockchain à une expérience utilisateur « magique », permettant aux participants de « contrôler le temps » et de le convertir en valeur réelle. Plongez dans MagicTime et construisez un futur où chaque seconde compte.` },
    { q: `Qu’est-ce que MAGT ?`, a: `MAGT est le token utilitaire natif de l’écosystème MAGIC TIME. Il sert à l’accès à l’écosystème, aux récompenses, aux futurs produits et aux fonctionnalités de gouvernance.` },
    { q: `Quel réseau est utilisé ?`, a: `MAGIC TIME est construit sur The Open Network (TON), garantissant des transactions rapides, des frais faibles et une intégration fluide avec les portefeuilles.` },
    { q: `Comment fonctionne la prévente ?`, a: `Les participants envoient des TON au smart contract de prévente. Les tokens achetés sont enregistrés on‑chain et deviennent réclamables via la fonction Claim.` },
    { q: `Reçois‑je les tokens immédiatement après l’achat ?`, a: `Non. Les tokens ne sont pas transférés instantanément. Ils deviennent réclamables et vous pourrez les retirer plus tard via le bouton Claim.
Cette approche renforce la sécurité et évite les livraisons échouées.` },
    { q: `Quand puis‑je réclamer mes tokens ?`, a: `Vous pouvez réclamer vos tokens une fois que le contrat de prévente autorise le Claim. Une fois activé, vous pourrez retirer vos MAGT disponibles à tout moment via le bouton Claim.` },
    { q: `Y a‑t‑il un vesting ou un verrouillage ?`, a: `Oui. Les tokens de prévente sont soumis à un calendrier de vesting et de verrouillage, qui sera publié avant le listing public afin d’assurer la stabilité à long terme du projet.` },
    { q: `Quel pourcentage de tokens est alloué à la prévente ?`, a: `5 % de l’offre totale de tokens est alloué à ce round de prévente. Les tokens invendus seront réservés au développement futur de l’écosystème et à d’autres projets.` },
    { q: `Existe‑t‑il un programme de parrainage ?`, a: `Oui. Vous pouvez gagner des MAGT supplémentaires en partageant votre lien de parrainage. Les récompenses s’accumulent et peuvent être retirées via le même mécanisme Claim.` },
    { q: `Qui peut voir les récompenses de parrainage ?`, a: `Seul le propriétaire du parrainage (le portefeuille ayant partagé le lien) peut voir et réclamer les récompenses.` },
    { q: `Quels portefeuilles sont pris en charge ?`, a: `Tous les portefeuilles compatibles TON Connect sont pris en charge, notamment Tonkeeper, Telegram Wallet, MyTonWallet et d’autres portefeuilles TON.` },
    { q: `Le smart contract est‑il audité ?`, a: `Le smart contract est open‑source et disponible pour examen public. Le statut de l’audit sera annoncé séparément.` },
    { q: `Puis‑je vendre ou transférer MAGT pendant la prévente ?`, a: `Non. Les tokens MAGT ne peuvent pas être transférés ou échangés avant la fin de la prévente et le listing officiel.` },
    { q: `Que se passe‑t‑il si une transaction échoue ?`, a: `Si une transaction échoue ou est partiellement exécutée, les TON non utilisés sont automatiquement remboursés et les soldes réclamables sont restaurés en toute sécurité on‑chain.` },
    { q: `Mon investissement est‑il sûr ?`, a: `Toute la logique de la prévente est gérée par des smart contracts on‑chain. Aucune intervention manuelle, aucun portefeuille custodial, aucun solde off‑chain.
Cependant, comme tout investissement crypto, la participation comporte des risques.` },
    { q: `Où puis‑je suivre les actualités du projet ?`, a: `Les annonces et mises à jour officielles seront publiées via le site web, les réseaux sociaux et les plateformes communautaires.` },
  ],
  pt: [
    { q: `O que é MAGIC TIME?`, a: `MAGIC TIME é um projeto blockchain baseado na TON, focado em construir um ecossistema escalável onde mecânicas baseadas em tempo se unem às finanças descentralizadas. A pré-venda permite que os primeiros apoiadores adquiram tokens MAGT antes do listing público.
MagicTime é um projeto cripto inovador em que o tempo se torna um ativo digital. Cada token MagicTime representa um fragmento de tempo que pode ser investido, trocado e usado dentro de um ecossistema único. A plataforma combina tecnologia blockchain com uma experiência de usuário “mágica”, permitindo que os participantes “controlem o tempo” e o convertam em valor real. Mergulhe no MagicTime e construa um futuro onde cada segundo importa.` },
    { q: `O que é MAGT?`, a: `MAGT é o token utilitário nativo do ecossistema MAGIC TIME. Ele é usado para acesso ao ecossistema, recompensas, produtos futuros e recursos de governança.` },
    { q: `Qual rede é utilizada?`, a: `MAGIC TIME é construído na The Open Network (TON), garantindo transações rápidas, baixas taxas e integração perfeita com carteiras.` },
    { q: `Como funciona a pré-venda?`, a: `Os participantes enviam TON para o contrato inteligente da pré-venda. Os tokens comprados são registrados on-chain e se tornam resgatáveis via a função Claim.` },
    { q: `Eu recebo os tokens imediatamente após a compra?`, a: `Não. Os tokens não são transferidos instantaneamente. Em vez disso, eles se tornam resgatáveis e você pode sacá-los mais tarde usando o botão Claim.
Essa abordagem aumenta a segurança e evita entregas com falha.` },
    { q: `Quando posso resgatar meus tokens?`, a: `Você pode resgatar os tokens depois que o contrato da pré-venda habilitar o Claim. Uma vez ativado, você poderá sacar seus MAGT disponíveis a qualquer momento usando o botão Claim.` },
    { q: `Existe vesting ou lockup?`, a: `Sim. Os tokens da pré-venda estão sujeitos a um cronograma de vesting e lockup, que será publicado antes do listing público para garantir a estabilidade de longo prazo do projeto.` },
    { q: `Qual porcentagem de tokens é destinada à pré-venda?`, a: `5% do fornecimento total de tokens é destinado a este round de pré-venda. Os tokens não vendidos serão reservados para o desenvolvimento do ecossistema e projetos futuros.` },
    { q: `Existe programa de indicação?`, a: `Sim. Você pode ganhar MAGT adicionais compartilhando seu link de indicação. As recompensas de indicação se acumulam e podem ser sacadas usando o mesmo mecanismo de Claim.` },
    { q: `Quem pode ver as recompensas de indicação?`, a: `Apenas o dono da indicação (a carteira que compartilhou o link) pode ver e resgatar as recompensas.` },
    { q: `Quais carteiras são suportadas?`, a: `Todas as carteiras compatíveis com TON Connect são suportadas, incluindo Tonkeeper, Telegram Wallet, MyTonWallet e outras carteiras TON compatíveis.` },
    { q: `O smart contract é auditado?`, a: `O smart contract é open-source e está disponível para revisão pública. O status da auditoria será anunciado separadamente.` },
    { q: `Posso vender ou transferir MAGT durante a pré-venda?`, a: `Não. Os tokens MAGT não podem ser transferidos ou negociados até depois da pré-venda e do listing oficial.` },
    { q: `O que acontece se uma transação falhar?`, a: `Se uma transação falhar ou for parcialmente executada, o TON não utilizado é reembolsado automaticamente e os saldos resgatáveis são restaurados com segurança on-chain.` },
    { q: `Meu investimento é seguro?`, a: `Toda a lógica da pré-venda é tratada por smart contracts on-chain. Não há intervenção manual, carteiras custodiais nem saldos off-chain.
No entanto, como qualquer investimento cripto, a participação envolve riscos.` },
    { q: `Onde posso acompanhar as atualizações do projeto?`, a: `Anúncios e atualizações oficiais serão publicados no site, nas redes sociais e nas plataformas da comunidade.` },
  ],
  cn: [
    { q: `什么是 MAGIC TIME？`, a: `MAGIC TIME 是一个基于 TON 的区块链项目，致力于构建可扩展的生态系统，将“时间机制”与去中心化金融相结合。预售让早期支持者在公开上市前获得 MAGT 代币。
MagicTime 是一个创新的加密项目，让时间成为数字资产。每个 MagicTime 代币代表一段时间，可用于投资、兑换并在独特的生态中使用。平台将区块链技术与“魔法般”的用户体验结合，帮助参与者“掌控时间”并将其转化为真实价值。加入 MagicTime，打造一个每一秒都很重要的未来。` },
    { q: `什么是 MAGT？`, a: `MAGT 是 MAGIC TIME 生态系统的原生实用型代币，用于生态访问、奖励、未来产品以及治理功能。` },
    { q: `使用的是哪条网络？`, a: `MAGIC TIME 构建在 The Open Network（TON）上，确保交易快速、手续费低，并可与钱包顺畅集成。` },
    { q: `预售如何运作？`, a: `参与者向预售智能合约发送 TON。购买的代币会在链上记录，并可通过 Claim 功能领取。` },
    { q: `购买后会立刻收到代币吗？`, a: `不会。代币不会立即转账，而是变为可领取（claimable），你可以稍后通过 Claim 按钮提取。
这种方式更安全，并可避免发送失败。` },
    { q: `什么时候可以领取我的代币？`, a: `当预售合约启用 Claim 后即可领取。一旦启用，你可以随时通过 Claim 按钮提取可用的 MAGT。` },
    { q: `是否有锁仓或释放计划？`, a: `有。预售代币将遵循锁仓与线性释放计划，具体安排会在公开上市前公布，以确保项目长期稳定。` },
    { q: `预售分配了多少比例的代币？`, a: `本轮预售分配总供应量的 5%。未售出的代币将保留用于未来生态发展与项目建设。` },
    { q: `是否有推荐（邀请）计划？`, a: `有。你可以分享你的推荐链接来获得额外的 MAGT。推荐奖励会累积，并可通过同样的 Claim 机制提取。` },
    { q: `谁可以看到推荐奖励？`, a: `只有推荐链接的拥有者（分享该链接的钱包）可以看到并领取推荐奖励。` },
    { q: `支持哪些钱包？`, a: `支持所有兼容 TON Connect 的钱包，包括 Tonkeeper、Telegram Wallet、MyTonWallet 以及其他 TON 钱包。` },
    { q: `智能合约是否经过审计？`, a: `智能合约开源并可供公众审查。审计状态将另行公布。` },
    { q: `预售期间可以出售或转账 MAGT 吗？`, a: `不可以。MAGT 在预售结束并正式上市之前无法转账或交易。` },
    { q: `如果交易失败会怎样？`, a: `如果交易失败或部分成交，未使用的 TON 会自动退回，可领取余额会在链上安全恢复。` },
    { q: `我的投资安全吗？`, a: `预售逻辑完全由链上智能合约执行，无人工干预、无托管钱包、无链下余额。
但与任何加密投资一样，参与仍存在风险。` },
    { q: `在哪里关注项目动态？`, a: `官方公告与更新将通过网站、社交渠道和社区平台发布。` },
  ],
  in: [
    { q: `MAGIC TIME क्या है?`, a: `MAGIC TIME एक TON‑आधारित ब्लॉकचेन प्रोजेक्ट है, जिसका उद्देश्य एक स्केलेबल इकोसिस्टम बनाना है जहाँ समय‑आधारित मैकेनिक्स और विकेंद्रीकृत वित्त (DeFi) एक साथ आते हैं। प्रीसेल शुरुआती समर्थकों को पब्लिक लिस्टिंग से पहले MAGT टोकन प्राप्त करने का अवसर देता है।
MagicTime एक नवोन्मेषी क्रिप्टो प्रोजेक्ट है जहाँ समय एक डिजिटल एसेट बन जाता है। हर MagicTime टोकन समय का एक टुकड़ा दर्शाता है जिसे निवेश किया जा सकता है, एक्सचेंज किया जा सकता है और एक अनोखे इकोसिस्टम में उपयोग किया जा सकता है। यह प्लेटफ़ॉर्म ब्लॉकचेन तकनीक को “मैजिकल” यूज़र एक्सपीरियंस के साथ जोड़ता है, जिससे प्रतिभागी “समय को नियंत्रित” कर सकते हैं और उसे वास्तविक मूल्य में बदल सकते हैं। MagicTime में शामिल हों और ऐसा भविष्य बनाएं जहाँ हर सेकंड मायने रखता है।` },
    { q: `MAGT क्या है?`, a: `MAGT MAGIC TIME इकोसिस्टम का नेटिव यूटिलिटी टोकन है। इसका उपयोग इकोसिस्टम एक्सेस, रिवॉर्ड्स, भविष्य के प्रोडक्ट्स और गवर्नेंस फीचर्स के लिए होता है।` },
    { q: `कौन‑सा नेटवर्क उपयोग किया जाता है?`, a: `MAGIC TIME The Open Network (TON) पर बना है, जो तेज़ ट्रांज़ैक्शन, कम फीस और आसान वॉलेट इंटीग्रेशन सुनिश्चित करता है।` },
    { q: `प्रीसेल कैसे काम करता है?`, a: `प्रतिभागी प्रीसेल स्मार्ट कॉन्ट्रैक्ट को TON भेजते हैं। खरीदे गए टोकन ऑन‑चेन रिकॉर्ड होते हैं और Claim फ़ंक्शन के जरिए क्लेम किए जा सकते हैं।` },
    { q: `क्या खरीद के तुरंत बाद मुझे टोकन मिलते हैं?`, a: `नहीं। टोकन तुरंत ट्रांसफ़र नहीं होते। वे “claimable” बन जाते हैं और आप बाद में Claim बटन से उन्हें निकाल सकते हैं।
यह तरीका सुरक्षा बढ़ाता है और डिलीवरी फेल होने से बचाता है।` },
    { q: `मैं अपने टोकन कब क्लेम कर सकता हूँ?`, a: `जब प्रीसेल कॉन्ट्रैक्ट Claim को अनुमति देता है तब टोकन क्लेम किए जा सकते हैं। सक्षम होने के बाद आप किसी भी समय Claim बटन से उपलब्ध MAGT निकाल सकते हैं।` },
    { q: `क्या कोई वेस्टिंग या लॉक‑अप है?`, a: `हाँ। प्रीसेल टोकन वेस्टिंग और लॉक‑अप शेड्यूल के अधीन हैं, जिसे पब्लिक लिस्टिंग से पहले प्रकाशित किया जाएगा ताकि प्रोजेक्ट की दीर्घकालिक स्थिरता बनी रहे।` },
    { q: `प्रीसेल के लिए कितने प्रतिशत टोकन आवंटित हैं?`, a: `कुल टोकन सप्लाई का 5% इस प्रीसेल राउंड के लिए आवंटित है। बिना बिके टोकन भविष्य के इकोसिस्टम डेवलपमेंट और प्रोजेक्ट्स के लिए सुरक्षित रखे जाएंगे।` },
    { q: `क्या रेफ़रल प्रोग्राम है?`, a: `हाँ। आप अपना रेफ़रल लिंक शेयर करके अतिरिक्त MAGT कमा सकते हैं। रेफ़रल रिवॉर्ड्स जमा होते हैं और उसी Claim मैकेनिज़्म से निकाले जा सकते हैं।` },
    { q: `रेफ़रल रिवॉर्ड्स कौन देख सकता है?`, a: `केवल रेफ़रल ओनर (जिस वॉलेट ने रेफ़रल लिंक शेयर किया) ही रेफ़रल रिवॉर्ड्स देख और क्लेम कर सकता है।` },
    { q: `कौन‑कौन से वॉलेट सपोर्टेड हैं?`, a: `सभी TON Connect‑compatible वॉलेट सपोर्टेड हैं, जैसे Tonkeeper, Telegram Wallet, MyTonWallet और अन्य TON वॉलेट्स।` },
    { q: `क्या स्मार्ट कॉन्ट्रैक्ट ऑडिटेड है?`, a: `स्मार्ट कॉन्ट्रैक्ट ओपन‑सोर्स है और सार्वजनिक समीक्षा के लिए उपलब्ध है। ऑडिट स्टेटस अलग से घोषित किया जाएगा।` },
    { q: `क्या मैं प्रीसेल के दौरान MAGT बेच या ट्रांसफ़र कर सकता हूँ?`, a: `नहीं। प्रीसेल और आधिकारिक लिस्टिंग के बाद ही MAGT ट्रांसफ़र/ट्रेड किया जा सकता है।` },
    { q: `अगर ट्रांज़ैक्शन फेल हो जाए तो क्या होगा?`, a: `यदि ट्रांज़ैक्शन फेल हो जाए या आंशिक रूप से पूरा हो, तो अप्रयुक्त TON अपने‑आप रिफंड हो जाता है और claimable बैलेंस ऑन‑चेन सुरक्षित रूप से रिस्टोर हो जाते हैं।` },
    { q: `क्या मेरा निवेश सुरक्षित है?`, a: `सारी प्रीसेल लॉजिक ऑन‑चेन स्मार्ट कॉन्ट्रैक्ट्स द्वारा संचालित होती है। कोई मैन्युअल इंटरवेंशन नहीं, कोई कस्टोडियल वॉलेट नहीं, और कोई ऑफ‑चेन बैलेंस नहीं।
फिर भी, किसी भी क्रिप्टो निवेश की तरह, भागीदारी में जोखिम होता है।` },
    { q: `मैं प्रोजेक्ट अपडेट्स कहाँ फॉलो कर सकता हूँ?`, a: `आधिकारिक घोषणाएँ और अपडेट्स वेबसाइट, सोशल चैनल्स और कम्युनिटी प्लेटफ़ॉर्म्स पर प्रकाशित किए जाएंगे।` },
  ],
  id: [
    { q: `Apa itu MAGIC TIME?`, a: `MAGIC TIME adalah proyek blockchain berbasis TON yang berfokus membangun ekosistem yang skalabel, di mana mekanik berbasis waktu bertemu dengan keuangan terdesentralisasi. Presale memungkinkan pendukung awal memperoleh token MAGT sebelum listing publik.
MagicTime adalah proyek kripto inovatif di mana waktu menjadi aset digital. Setiap token MagicTime merepresentasikan fragmen waktu yang dapat diinvestasikan, dipertukarkan, dan digunakan dalam ekosistem yang unik. Platform ini menggabungkan teknologi blockchain dengan pengalaman pengguna yang “magis”, memungkinkan peserta “mengendalikan waktu” dan mengubahnya menjadi nilai nyata. Masuk ke MagicTime dan bangun masa depan di mana setiap detik berarti.` },
    { q: `Apa itu MAGT?`, a: `MAGT adalah token utilitas native dari ekosistem MAGIC TIME. Token ini digunakan untuk akses ekosistem, reward, produk masa depan, dan fitur governance.` },
    { q: `Jaringan apa yang digunakan?`, a: `MAGIC TIME dibangun di The Open Network (TON), memastikan transaksi cepat, biaya rendah, dan integrasi dompet yang mulus.` },
    { q: `Bagaimana presale bekerja?`, a: `Peserta mengirim TON ke smart contract presale. Token yang dibeli dicatat on-chain dan menjadi dapat diklaim melalui fungsi Claim.` },
    { q: `Apakah saya menerima token segera setelah membeli?`, a: `Tidak. Token tidak ditransfer secara instan. Token menjadi “claimable” dan dapat Anda tarik nanti menggunakan tombol Claim.
Pendekatan ini meningkatkan keamanan dan mencegah kegagalan pengiriman.` },
    { q: `Kapan saya bisa mengklaim token saya?`, a: `Token dapat diklaim setelah kontrak presale mengizinkan Claim. Setelah diaktifkan, Anda dapat menarik MAGT yang tersedia kapan saja menggunakan tombol Claim.` },
    { q: `Apakah ada vesting atau lockup?`, a: `Ya. Token presale mengikuti jadwal vesting dan lockup yang akan dipublikasikan sebelum listing publik untuk memastikan stabilitas proyek jangka panjang.` },
    { q: `Berapa persen token dialokasikan untuk presale?`, a: `5% dari total suplai token dialokasikan untuk ronde presale ini. Token yang tidak terjual akan disimpan untuk pengembangan ekosistem dan proyek masa depan.` },
    { q: `Apakah ada program referral?`, a: `Ya. Anda bisa mendapatkan MAGT tambahan dengan membagikan tautan referral. Hadiah referral akan terakumulasi dan dapat ditarik menggunakan mekanisme Claim yang sama.` },
    { q: `Siapa yang bisa melihat hadiah referral?`, a: `Hanya pemilik referral (dompet yang membagikan tautan referral) yang dapat melihat dan mengklaim hadiah referral.` },
    { q: `Dompet apa saja yang didukung?`, a: `Semua dompet yang kompatibel dengan TON Connect didukung, termasuk Tonkeeper, Telegram Wallet, MyTonWallet, dan dompet TON lainnya.` },
    { q: `Apakah smart contract diaudit?`, a: `Smart contract bersifat open-source dan tersedia untuk ditinjau publik. Status audit akan diumumkan terpisah.` },
    { q: `Bisakah saya menjual atau mentransfer MAGT saat presale?`, a: `Tidak. Token MAGT tidak dapat ditransfer atau diperdagangkan sampai presale selesai dan listing resmi dilakukan.` },
    { q: `Apa yang terjadi jika transaksi gagal?`, a: `Jika transaksi gagal atau hanya terisi sebagian, TON yang tidak terpakai akan otomatis dikembalikan dan saldo claimable dipulihkan dengan aman di on-chain.` },
    { q: `Apakah investasi saya aman?`, a: `Seluruh logika presale ditangani oleh smart contract on-chain. Tidak ada intervensi manual, tidak ada dompet kustodian, dan tidak ada saldo off-chain.
Namun, seperti investasi kripto lainnya, partisipasi tetap memiliki risiko.` },
    { q: `Di mana saya bisa mengikuti pembaruan proyek?`, a: `Pengumuman dan pembaruan resmi akan dipublikasikan melalui situs web, kanal sosial, dan platform komunitas.` },
  ],
  sa: [
    { q: `ما هو MAGIC TIME؟`, a: `MAGIC TIME هو مشروع بلوكشين مبني على TON يركز على بناء نظام بيئي قابل للتوسع حيث تلتقي آليات الوقت مع التمويل اللامركزي. تتيح مرحلة البيع المسبق للمؤيدين الأوائل الحصول على توكنات MAGT قبل الإدراج العام.
MagicTime مشروع كريبتو مبتكر تصبح فيه «الوقت» أصلًا رقميًا. يمثّل كل توكن MagicTime جزءًا من الوقت يمكن استثماره وتبادله واستخدامه داخل نظام بيئي فريد. تجمع المنصة بين تقنية البلوكشين وتجربة مستخدم «سحرية»، مما يتيح للمشاركين «التحكم بالوقت» وتحويله إلى قيمة حقيقية. انضم إلى MagicTime وابنِ مستقبلًا تكون فيه كل ثانية ذات معنى.` },
    { q: `ما هو MAGT؟`, a: `MAGT هو توكن المنفعة الأساسي لنظام MAGIC TIME. يُستخدم للوصول إلى النظام البيئي والمكافآت والمنتجات المستقبلية وميزات الحوكمة.` },
    { q: `ما الشبكة المستخدمة؟`, a: `تم بناء MAGIC TIME على The Open Network (TON)، مما يضمن معاملات سريعة ورسومًا منخفضة وتكاملاً سلسًا مع المحافظ.` },
    { q: `كيف يعمل البيع المسبق؟`, a: `يرسل المشاركون TON إلى عقد البيع المسبق الذكي. يتم تسجيل التوكنات المشتراة على السلسلة وتصبح قابلة للمطالبة عبر وظيفة Claim.` },
    { q: `هل أستلم التوكنات فور الشراء؟`, a: `لا. لا يتم تحويل التوكنات فورًا. بدلاً من ذلك تصبح «قابلة للمطالبة»، ويمكنك سحبها لاحقًا باستخدام زر Claim.
هذا الأسلوب يزيد الأمان ويمنع فشل التسليم.` },
    { q: `متى يمكنني المطالبة بتوكناتي؟`, a: `يمكن المطالبة بالتوكنات بعد أن يسمح عقد البيع المسبق بوظيفة Claim. بعد التفعيل يمكنك سحب MAGT المتاح في أي وقت باستخدام زر Claim.` },
    { q: `هل يوجد فيستينغ أو قفل؟`, a: `نعم. توكنات البيع المسبق تخضع لجدول فيستينغ وقفل سيتم نشره قبل الإدراج العام لضمان استقرار المشروع على المدى الطويل.` },
    { q: `ما نسبة التوكنات المخصصة للبيع المسبق؟`, a: `تم تخصيص 5% من إجمالي المعروض لهذه الجولة من البيع المسبق. سيتم الاحتفاظ بالتوكنات غير المباعة لتطوير النظام البيئي ومشاريع مستقبلية.` },
    { q: `هل يوجد برنامج إحالة؟`, a: `نعم. يمكنك كسب MAGT إضافية عبر مشاركة رابط الإحالة الخاص بك. تتراكم مكافآت الإحالة ويمكن سحبها باستخدام آلية Claim نفسها.` },
    { q: `من يمكنه رؤية مكافآت الإحالة؟`, a: `فقط صاحب الإحالة (المحفظة التي شاركت رابط الإحالة) يمكنه رؤية مكافآت الإحالة والمطالبة بها.` },
    { q: `ما المحافظ المدعومة؟`, a: `جميع المحافظ المتوافقة مع TON Connect مدعومة، بما في ذلك Tonkeeper وTelegram Wallet وMyTonWallet ومحافظ TON الأخرى.` },
    { q: `هل تم تدقيق العقد الذكي؟`, a: `العقد الذكي مفتوح المصدر ومتاح للمراجعة العامة. سيتم الإعلان عن حالة التدقيق بشكل منفصل.` },
    { q: `هل يمكنني بيع أو تحويل MAGT أثناء البيع المسبق؟`, a: `لا. لا يمكن تحويل أو تداول توكنات MAGT إلا بعد انتهاء البيع المسبق والإدراج الرسمي.` },
    { q: `ماذا يحدث إذا فشلت المعاملة؟`, a: `إذا فشلت المعاملة أو تم تنفيذها جزئيًا، يتم رد TON غير المستخدم تلقائيًا وتتم استعادة الأرصدة القابلة للمطالبة بأمان على السلسلة.` },
    { q: `هل استثماري آمن؟`, a: `تتم إدارة منطق البيع المسبق بالكامل عبر عقود ذكية على السلسلة دون تدخل يدوي أو محافظ وصاية أو أرصدة خارج السلسلة.
ومع ذلك، مثل أي استثمار في العملات الرقمية، توجد مخاطر للمشاركة.` },
    { q: `أين يمكنني متابعة تحديثات المشروع؟`, a: `سيتم نشر الإعلانات والتحديثات الرسمية عبر الموقع الإلكتروني والقنوات الاجتماعية ومنصات المجتمع.` },
  ],
  bd: [
    { q: `MAGIC TIME কী?`, a: `MAGIC TIME হলো TON‑ভিত্তিক একটি ব্লকচেইন প্রজেক্ট, যার লক্ষ্য এমন একটি স্কেলযোগ্য ইকোসিস্টেম তৈরি করা যেখানে সময়‑ভিত্তিক মেকানিক্স এবং বিকেন্দ্রীভূত অর্থনীতি (DeFi) একসাথে কাজ করে। প্রিসেল‑এর মাধ্যমে প্রাথমিক সমর্থকেরা পাবলিক লিস্টিংয়ের আগে MAGT টোকেন সংগ্রহ করতে পারেন।
MagicTime একটি উদ্ভাবনী ক্রিপ্টো প্রজেক্ট যেখানে সময় একটি ডিজিটাল অ্যাসেট হয়ে যায়। প্রতিটি MagicTime টোকেন সময়ের একটি অংশকে প্রতিনিধিত্ব করে, যা বিনিয়োগ, এক্সচেঞ্জ এবং একটি অনন্য ইকোসিস্টেমে ব্যবহার করা যায়। প্ল্যাটফর্মটি ব্লকচেইন প্রযুক্তির সাথে “ম্যাজিক্যাল” ইউজার এক্সপেরিয়েন্স যুক্ত করে, যাতে অংশগ্রহণকারীরা “সময় নিয়ন্ত্রণ” করতে পারে এবং সেটিকে বাস্তব মূল্যে রূপান্তর করতে পারে। MagicTime‑এ যোগ দিন এবং এমন এক ভবিষ্যৎ গড়ুন যেখানে প্রতিটি সেকেন্ড গুরুত্বপূর্ণ।` },
    { q: `MAGT কী?`, a: `MAGT হলো MAGIC TIME ইকোসিস্টেমের নেটিভ ইউটিলিটি টোকেন। এটি ইকোসিস্টেম অ্যাক্সেস, রিওয়ার্ড, ভবিষ্যৎ প্রোডাক্ট এবং গভর্নেন্স ফিচারের জন্য ব্যবহৃত হয়।` },
    { q: `কোন নেটওয়ার্ক ব্যবহার করা হয়?`, a: `MAGIC TIME The Open Network (TON)‑এ নির্মিত, যা দ্রুত ট্রান্স্যাকশন, কম ফি এবং সহজ ওয়ালেট ইন্টিগ্রেশন নিশ্চিত করে।` },
    { q: `প্রিসেল কীভাবে কাজ করে?`, a: `অংশগ্রহণকারীরা প্রিসেল স্মার্ট কন্ট্র্যাক্টে TON পাঠায়। কেনা টোকেনগুলো অন‑চেইনে রেকর্ড হয় এবং Claim ফাংশনের মাধ্যমে ক্লেইম করা যায়।` },
    { q: `কেনার সাথে সাথে কি আমি টোকেন পাব?`, a: `না। টোকেন তাৎক্ষণিকভাবে ট্রান্সফার হয় না। বরং সেগুলো “claimable” হয়ে যায় এবং আপনি পরে Claim বাটন দিয়ে তুলে নিতে পারবেন।
এতে নিরাপত্তা বাড়ে এবং ডেলিভারি ব্যর্থ হওয়া রোধ হয়।` },
    { q: `আমি কখন আমার টোকেন ক্লেইম করতে পারব?`, a: `প্রিসেল কন্ট্র্যাক্ট Claim অনুমোদন করলে টোকেন ক্লেইম করা যাবে। একবার চালু হলে, আপনি যেকোনো সময় Claim বাটন দিয়ে আপনার উপলব্ধ MAGT তুলে নিতে পারবেন।` },
    { q: `ভেস্টিং বা লকআপ আছে কি?`, a: `আছে। প্রিসেল টোকেনগুলো ভেস্টিং ও লকআপ শিডিউলের অধীন থাকবে, যা পাবলিক লিস্টিংয়ের আগে প্রকাশ করা হবে যাতে প্রজেক্টের দীর্ঘমেয়াদি স্থিতিশীলতা নিশ্চিত হয়।` },
    { q: `প্রিসেলের জন্য কত শতাংশ টোকেন বরাদ্দ?`, a: `মোট টোকেন সরবরাহের 5% এই প্রিসেল রাউন্ডের জন্য বরাদ্দ। অবিক্রীত টোকেন ভবিষ্যৎ ইকোসিস্টেম ডেভেলপমেন্ট ও প্রজেক্টের জন্য সংরক্ষিত থাকবে।` },
    { q: `রেফারাল প্রোগ্রাম আছে কি?`, a: `আছে। আপনি আপনার রেফারাল লিংক শেয়ার করে অতিরিক্ত MAGT অর্জন করতে পারেন। রেফারাল রিওয়ার্ড জমা হয় এবং একই Claim মেকানিজম দিয়ে তুলে নেওয়া যায়।` },
    { q: `রেফারাল রিওয়ার্ড কে দেখতে পারবে?`, a: `শুধুমাত্র রেফারাল ওনার (যে ওয়ালেট রেফারাল লিংক শেয়ার করেছে) রেফারাল রিওয়ার্ড দেখতে এবং ক্লেইম করতে পারবে।` },
    { q: `কোন কোন ওয়ালেট সাপোর্টেড?`, a: `সব TON Connect‑compatible ওয়ালেট সাপোর্টেড, যেমন Tonkeeper, Telegram Wallet, MyTonWallet এবং অন্যান্য TON ওয়ালেট।` },
    { q: `স্মার্ট কন্ট্র্যাক্ট কি অডিটেড?`, a: `স্মার্ট কন্ট্র্যাক্টটি ওপেন‑সোর্স এবং পাবলিক রিভিউয়ের জন্য উপলব্ধ। অডিট স্ট্যাটাস আলাদাভাবে ঘোষণা করা হবে।` },
    { q: `প্রিসেলের সময় কি MAGT বিক্রি বা ট্রান্সফার করা যাবে?`, a: `না। প্রিসেল শেষ হওয়া এবং অফিসিয়াল লিস্টিংয়ের আগে MAGT ট্রান্সফার বা ট্রেড করা যাবে না।` },
    { q: `ট্রান্স্যাকশন ফেইল হলে কী হবে?`, a: `ট্রান্স্যাকশন ফেইল হলে বা আংশিকভাবে পূরণ হলে, অব্যবহৃত TON স্বয়ংক্রিয়ভাবে রিফান্ড হবে এবং claimable ব্যালেন্স অন‑চেইনে নিরাপদভাবে রিস্টোর হবে।` },
    { q: `আমার বিনিয়োগ কি নিরাপদ?`, a: `প্রিসেলের সব লজিক অন‑চেইন স্মার্ট কন্ট্র্যাক্ট দ্বারা পরিচালিত হয়। কোনো ম্যানুয়াল ইন্টারভেনশন নেই, কোনো কাস্টডিয়াল ওয়ালেট নেই, এবং কোনো অফ‑চেইন ব্যালেন্স নেই।
তবে যেকোনো ক্রিপ্টো বিনিয়োগের মতোই, অংশগ্রহণে ঝুঁকি রয়েছে।` },
    { q: `আমি কোথায় প্রজেক্ট আপডেট অনুসরণ করতে পারি?`, a: `অফিসিয়াল ঘোষণা ও আপডেট ওয়েবসাইট, সোশ্যাল চ্যানেল এবং কমিউনিটি প্ল্যাটফর্মের মাধ্যমে প্রকাশ করা হবে।` },
  ],
};

export type DocKey = "privacy" | "terms" | "disclaimer" | "liquidity";
export const DOCS: Record<LangCode, Record<DocKey, string>> = {
  en: {
    privacy: `Last updated: 1.01.2026

This Privacy Policy explains how we collect, use, share, and protect your information when you visit or interact with our website https://magtcoin.com
 and related services (“Site”).

1. Information We Collect

a) Personal Data

We do not collect private keys or seed phrases. We may collect:

Wallet addresses used for transactions

IP address and device/browser data (via analytics)

Cookies and usage information

b) Automatically Collected Data

We use analytics tools (e.g., Google Analytics) to collect:

Page visit data

Click data

Session duration

2. Use of Information

We use your information to:

Provide and improve our services

Analyze usage trends

Respond to support requests

Ensure security and fraud prevention

3. Sharing of Information

We do NOT sell or share personal data with third parties for marketing.

We may share data:

With analytics providers

If required by law

4. Security

We implement industry-standard security measures to protect data.

5. Changes to Policy

We may update this policy. If material changes occur, we will notify users on the Site.

6. Contact

For questions: magtcoin@gmail.com`,
    terms: `Effective Date: 1.01.2026

These Terms of Use (“Terms”) govern your access to and use of https://magtcoin.com
 and related services (“Site”).
By using the Site, you agree to these Terms.

1. Acceptance of Terms

By accessing the Site, you affirm that you understand and agree to all Terms.

2. No Investment Advice

Content on the Site is for informational purposes only and does not constitute financial, investment, legal, or tax advice.

3. Risks

Participating in blockchain token sales involves significant risk. You may lose all funds.

4. User Responsibilities

Users must:

Be legally allowed to participate

Understand blockchain transaction risks

Verify all data independently

5. Smart Contract Priority

Smart contract code governs transactions. To the fullest extent permitted by law, the Site is not responsible for smart contract behavior.

6. Intellectual Property

All Site content is owned by us and protected by law.

7. Modification

We may update these Terms at any time.

8. Governing Law

Applicable law: Czech Republic (or country of company registration)

9. Contact

For questions: magtcoin@gmail.com`,
    disclaimer: `The information provided on https://magtcoin.com
 is for general informational purposes only and does not constitute financial, investment, legal, or tax advice.

You understand and agree that:

We are not investment advisors

Tokens offered via presale are high risk

You should conduct your own research (“DYOR”)

You may lose all funds

By participating in our token sale, you accept all risks.`,
    liquidity: `Liquidity Lock

After the presale and listing, the Liquidity Provision Tokens (LP Tokens) will be used for other Magic Time projects.
This is done for future use to ensure trust and reduce the risk of stock theft.

Presale Participants

5% of the total token supply is allocated for this presale

All tokens purchased during the presale are locked starting from the presale start date

Tokens remain fully locked until 2027

After the lock period ends, tokens are released linearly

No more than 25% of the total token supply will enter circulation within the first year after unlock`,
  },
  uk: {
    privacy: `Останнє оновлення: 01.01.2026

Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо, передаємо та захищаємо вашу інформацію під час відвідування або взаємодії з нашим вебсайтом https://magtcoin.com
 та пов’язаними сервісами («Сайт»).

1. Яку інформацію ми збираємо

a) Персональні дані
Ми не збираємо приватні ключі або seed-фрази.
Ми можемо збирати:

адреси гаманців, що використовуються для транзакцій

IP-адресу та дані про пристрій/браузер (через аналітику)

cookies та інформацію про використання

b) Автоматично зібрані дані
Ми використовуємо аналітичні інструменти (наприклад, Google Analytics) для збору:

даних про відвідування сторінок

кліків

тривалості сесій

2. Використання інформації

Ми використовуємо інформацію для:

надання та покращення наших сервісів

аналізу тенденцій використання

відповіді на запити служби підтримки

забезпечення безпеки та запобігання шахрайству

3. Передача інформації

Ми НЕ продаємо і не передаємо персональні дані третім сторонам у маркетингових цілях.
Ми можемо передавати дані:

аналітичним провайдерам

якщо цього вимагає закон

4. Безпека

Ми застосовуємо стандартні галузеві заходи безпеки для захисту даних.

5. Зміни до політики

Ми можемо оновлювати цю політику. У разі суттєвих змін ми повідомимо користувачів на Сайті.

6. Контакти

З питань звертайтесь: magtcoin@gmail.com`,
    terms: `Дата набрання чинності: 01.01.2026

Ці Умови використання («Умови») регулюють доступ та використання сайту https://magtcoin.com
 і пов’язаних сервісів («Сайт»). Користуючись Сайтом, ви погоджуєтесь із цими Умовами.

1. Прийняття умов

Отримуючи доступ до Сайту, ви підтверджуєте, що розумієте та приймаєте всі Умови.

2. Відсутність інвестиційних порад

Контент на Сайті має виключно інформаційний характер і не є фінансовою, інвестиційною, юридичною або податковою порадою.

3. Ризики

Участь у продажах блокчейн-токенів пов’язана зі значними ризиками. Ви можете втратити всі кошти.

4. Обов’язки користувача

Користувачі повинні:

мати законне право на участь

розуміти ризики блокчейн-транзакцій

самостійно перевіряти всю інформацію

5. Пріоритет смартконтрактів

Код смартконтрактів має пріоритет у транзакціях. У межах, дозволених законом, Сайт не несе відповідальності за поведінку смартконтрактів.

6. Інтелектуальна власність

Увесь контент Сайту належить нам і захищений законом.

7. Зміни

Ми можемо змінювати ці Умови у будь-який час.

8. Застосовне право

Застосовне право: Чеська Республіка (або країна реєстрації компанії).

9. Контакти

З питань звертайтесь: magtcoin@gmail.com`,
    disclaimer: `Інформація на https://magtcoin.com
 надається лише в загальноінформаційних цілях і не є фінансовою, інвестиційною, юридичною або податковою порадою.

Ви розумієте та погоджуєтесь, що:

ми не є інвестиційними радниками

токени, що продаються на пресейлі, мають високий ризик

ви повинні проводити власне дослідження (DYOR)

ви можете втратити всі кошти

Беручи участь у токенсейлі, ви приймаєте всі ризики.`,
    liquidity: `Блокування ліквідності
Після завершення пресейлу та лістингу LP-токени будуть використані в інших проєктах Magic Time.
Це робиться для майбутнього використання з метою підвищення довіри та зниження ризику крадіжки ліквідності.

Учасники пресейлу

5% від загальної пропозиції токенів виділено на цей пресейл

усі токени, придбані під час пресейлу, блокуються з моменту старту пресейлу

токени залишаються повністю заблокованими до 2027 року

після завершення періоду блокування токени розблоковуються лінійно

не більше 25% від загальної пропозиції токенів потрапить в обіг протягом першого року після розблокування`,
  },
  ru: {
    privacy: `Последнее обновление: 01.01.2026

Настоящая Политика конфиденциальности объясняет, как мы собираем, используем, передаём и защищаем вашу информацию при посещении или взаимодействии с нашим сайтом https://magtcoin.com
 и связанными сервисами («Сайт»).

1. Информация, которую мы собираем

a) Персональные данные
Мы не собираем приватные ключи или seed-фразы.
Мы можем собирать:

адреса кошельков, используемые для транзакций

IP-адрес и данные об устройстве/браузере (через аналитику)

cookies и информацию об использовании

b) Автоматически собираемые данные
Мы используем аналитические инструменты (например, Google Analytics) для сбора:

данных о посещении страниц

данных о кликах

продолжительности сессий

2. Использование информации

Мы используем вашу информацию для:

предоставления и улучшения наших сервисов

анализа тенденций использования

ответа на запросы службы поддержки

обеспечения безопасности и предотвращения мошенничества

3. Передача информации

Мы НЕ продаём и не передаём персональные данные третьим лицам в маркетинговых целях.
Мы можем передавать данные:

аналитическим провайдерам

если этого требует закон

4. Безопасность

Мы применяем стандартные отраслевые меры безопасности для защиты данных.

5. Изменения политики

Мы можем обновлять данную политику. В случае существенных изменений мы уведомим пользователей на Сайте.

6. Контакты

По вопросам обращайтесь: magtcoin@gmail.com`,
    terms: `Дата вступления в силу: 01.01.2026

Настоящие Условия использования («Условия») регулируют доступ и использование сайта https://magtcoin.com
 и связанных сервисов («Сайт»). Используя Сайт, вы соглашаетесь с данными Условиями.

1. Принятие условий

Получая доступ к Сайту, вы подтверждаете, что понимаете и принимаете все Условия.

2. Отсутствие инвестиционных рекомендаций

Контент на Сайте предоставляется исключительно в информационных целях и не является финансовой, инвестиционной, юридической или налоговой консультацией.

3. Риски

Участие в продажах блокчейн-токенов связано со значительными рисками. Вы можете потерять все средства.

4. Обязанности пользователя

Пользователи обязаны:

иметь законное право на участие

понимать риски блокчейн-транзакций

самостоятельно проверять всю информацию

5. Приоритет смарт-контрактов

Код смарт-контрактов имеет приоритет при осуществлении транзакций. В максимально допустимой законом степени Сайт не несёт ответственности за поведение смарт-контрактов.

6. Интеллектуальная собственность

Весь контент Сайта принадлежит нам и защищён законом.

7. Изменения

Мы можем обновлять данные Условия в любое время.

8. Применимое право

Применимое право: Чешская Республика (или страна регистрации компании).

9. Контакты

По вопросам обращайтесь: magtcoin@gmail.com`,
    disclaimer: `Информация, представленная на https://magtcoin.com
, носит общий информационный характер и не является финансовой, инвестиционной, юридической или налоговой консультацией.

Вы понимаете и соглашаетесь, что:

мы не являемся инвестиционными консультантами

токены, предлагаемые в рамках пресейла, являются высокорисковыми

вы должны проводить собственное исследование (DYOR)

вы можете потерять все средства

Участвуя в продаже токенов, вы принимаете все риски.`,
    liquidity: `Блокировка ликвидности
После завершения пресейла и листинга LP-токены будут использованы в других проектах Magic Time.
Это делается для будущего использования с целью повышения доверия и снижения риска кражи ликвидности.

Участники пресейла

5% от общего предложения токенов выделено для данного пресейла

все токены, приобретённые в ходе пресейла, блокируются с даты начала пресейла

токены остаются полностью заблокированными до 2027 года

после окончания периода блокировки токены разблокируются линейно

не более 25% от общего предложения токенов поступит в оборот в течение первого года после разблокировки`,
  },
  es: {
    privacy: `Última actualización: 01.01.2026

Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información cuando visita o interactúa con nuestro sitio web https://magtcoin.com
 y los servicios relacionados («Sitio»).

1. Información que recopilamos

a) Datos personales
No recopilamos claves privadas ni frases seed.
Podemos recopilar:

direcciones de wallets utilizadas para transacciones

dirección IP y datos del dispositivo/navegador (mediante analítica)

cookies e información de uso

b) Datos recopilados automáticamente
Utilizamos herramientas de analítica (por ejemplo, Google Analytics) para recopilar:

datos de visitas a páginas

datos de clics

duración de las sesiones

2. Uso de la información

Utilizamos su información para:

proporcionar y mejorar nuestros servicios

analizar tendencias de uso

responder a solicitudes de soporte

garantizar la seguridad y la prevención del fraude

3. Compartición de información

NO vendemos ni compartimos datos personales con terceros con fines de marketing.
Podemos compartir datos:

con proveedores de analítica

cuando sea requerido por la ley

4. Seguridad

Implementamos medidas de seguridad estándar de la industria para proteger los datos.

5. Cambios en la política

Podemos actualizar esta política. Si se producen cambios materiales, notificaremos a los usuarios en el Sitio.

6. Contacto

Para consultas: magtcoin@gmail.com`,
    terms: `Fecha de vigencia: 01.01.2026

Estos Términos de Uso («Términos») regulan su acceso y uso del sitio https://magtcoin.com
 y los servicios relacionados («Sitio»). Al utilizar el Sitio, usted acepta estos Términos.

1. Aceptación de los términos

Al acceder al Sitio, usted confirma que comprende y acepta todos los Términos.

2. Sin asesoramiento de inversión

El contenido del Sitio es únicamente informativo y no constituye asesoramiento financiero, de inversión, legal ni fiscal.

3. Riesgos

Participar en ventas de tokens blockchain implica riesgos significativos. Usted puede perder todos los fondos.

4. Responsabilidades del usuario

Los usuarios deben:

estar legalmente autorizados para participar

comprender los riesgos de las transacciones blockchain

verificar toda la información de forma independiente

5. Prioridad de los smart contracts

El código de los smart contracts rige las transacciones. En la máxima medida permitida por la ley, el Sitio no es responsable del comportamiento de los smart contracts.

6. Propiedad intelectual

Todo el contenido del Sitio es de nuestra propiedad y está protegido por la ley.

7. Modificaciones

Podemos actualizar estos Términos en cualquier momento.

8. Ley aplicable

Ley aplicable: República Checa (o el país de registro de la empresa).

9. Contacto

Para consultas: magtcoin@gmail.com`,
    disclaimer: `La información proporcionada en https://magtcoin.com
 es solo para fines informativos generales y no constituye asesoramiento financiero, de inversión, legal ni fiscal.

Usted entiende y acepta que:

no somos asesores de inversión

los tokens ofrecidos en el presale conllevan alto riesgo

debe realizar su propia investigación (DYOR)

puede perder todos los fondos

Al participar en la venta de tokens, usted acepta todos los riesgos.`,
    liquidity: `Bloqueo de liquidez
Después del presale y el listado, los tokens de provisión de liquidez (LP Tokens) se utilizarán en otros proyectos de Magic Time.
Esto se realiza para un uso futuro, con el fin de generar confianza y reducir el riesgo de robo de liquidez.

Participantes del presale

el 5% del suministro total de tokens está asignado a este presale

todos los tokens comprados durante el presale quedan bloqueados desde la fecha de inicio del presale

los tokens permanecerán completamente bloqueados hasta 2027

tras finalizar el período de bloqueo, los tokens se liberan de forma lineal

no más del 25% del suministro total de tokens entrará en circulación durante el primer año tras el desbloqueo`,
  },
  fr: {
    privacy: `Dernière mise à jour : 01.01.2026

Cette Politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous visitez ou interagissez avec notre site web https://magtcoin.com
 et les services associés (« Site »).

1. Informations que nous collectons

a) Données personnelles
Nous ne collectons pas de clés privées ni de phrases seed.
Nous pouvons collecter :

les adresses de portefeuilles utilisées pour les transactions

l’adresse IP et les données relatives à l’appareil/navigateur (via l’analytique)

les cookies et les informations d’utilisation

b) Données collectées automatiquement
Nous utilisons des outils d’analytique (par ex. Google Analytics) pour collecter :

les données de visite des pages

les données de clics

la durée des sessions

2. Utilisation des informations

Nous utilisons vos informations pour :

fournir et améliorer nos services

analyser les tendances d’utilisation

répondre aux demandes d’assistance

assurer la sécurité et la prévention de la fraude

3. Partage des informations

Nous NE vendons ni ne partageons des données personnelles avec des tiers à des fins marketing.
Nous pouvons partager des données :

avec des fournisseurs d’analytique

si la loi l’exige

4. Sécurité

Nous mettons en œuvre des mesures de sécurité conformes aux standards de l’industrie pour protéger les données.

5. Modifications de la politique

Nous pouvons mettre à jour cette politique. En cas de changements importants, nous en informerons les utilisateurs sur le Site.

6. Contact

Pour toute question : magtcoin@gmail.com`,
    terms: `Date d’entrée en vigueur : 01.01.2026

Ces Conditions d’utilisation (« Conditions ») régissent votre accès et votre utilisation du site https://magtcoin.com
 et des services associés (« Site »). En utilisant le Site, vous acceptez ces Conditions.

1. Acceptation des conditions

En accédant au Site, vous confirmez comprendre et accepter l’ensemble des Conditions.

2. Absence de conseil en investissement

Le contenu du Site est fourni à titre informatif uniquement et ne constitue pas un conseil financier, d’investissement, juridique ou fiscal.

3. Risques

La participation à des ventes de tokens blockchain comporte des risques significatifs. Vous pouvez perdre l’intégralité de vos fonds.

4. Responsabilités de l’utilisateur

Les utilisateurs doivent :

être légalement autorisés à participer

comprendre les risques liés aux transactions blockchain

vérifier toutes les informations de manière indépendante

5. Priorité des smart contracts

Le code des smart contracts régit les transactions. Dans toute la mesure permise par la loi, le Site n’est pas responsable du comportement des smart contracts.

6. Propriété intellectuelle

Tout le contenu du Site nous appartient et est protégé par la loi.

7. Modifications

Nous pouvons modifier ces Conditions à tout moment.

8. Droit applicable

Droit applicable : République tchèque (ou pays d’enregistrement de la société).

9. Contact

Pour toute question : magtcoin@gmail.com`,
    disclaimer: `Les informations fournies sur https://magtcoin.com
 sont à des fins d’information générale uniquement et ne constituent pas un conseil financier, d’investissement, juridique ou fiscal.

Vous comprenez et acceptez que :

nous ne sommes pas des conseillers en investissement

les tokens proposés lors du presale présentent un risque élevé

vous devez effectuer vos propres recherches (DYOR)

vous pouvez perdre l’intégralité de vos fonds

En participant à la vente de tokens, vous acceptez tous les risques.`,
    liquidity: `Verrouillage de la liquidité
Après le presale et le listing, les tokens de fourniture de liquidité (LP Tokens) seront utilisés pour d’autres projets Magic Time.
Cela vise une utilisation future afin d’instaurer la confiance et de réduire le risque de vol de liquidité.

Participants au presale

5 % de l’offre totale de tokens est alloué à ce presale

tous les tokens achetés pendant le presale sont verrouillés à partir de la date de début du presale

les tokens restent entièrement verrouillés jusqu’en 2027

après la période de verrouillage, les tokens sont libérés de manière linéaire

pas plus de 25 % de l’offre totale de tokens n’entrera en circulation au cours de la première année suivant le déverrouillage`,
  },
  pt: {
    privacy: `Última atualização: 01.01.2026

Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você visita ou interage com nosso site https://magtcoin.com
 e serviços relacionados (“Site”).

1. Informações que coletamos

a) Dados pessoais
Não coletamos chaves privadas nem frases seed.
Podemos coletar:

endereços de wallets usados em transações

endereço IP e dados do dispositivo/navegador (via analytics)

cookies e informações de uso

b) Dados coletados automaticamente
Utilizamos ferramentas de analytics (por exemplo, Google Analytics) para coletar:

dados de visitas às páginas

dados de cliques

duração das sessões

2. Uso das informações

Usamos suas informações para:

fornecer e melhorar nossos serviços

analisar tendências de uso

responder a solicitações de suporte

garantir segurança e prevenção de fraudes

3. Compartilhamento de informações

NÃO vendemos nem compartilhamos dados pessoais com terceiros para fins de marketing.
Podemos compartilhar dados:

com provedores de analytics

quando exigido por lei

4. Segurança

Implementamos medidas de segurança padrão da indústria para proteger os dados.

5. Alterações na política

Podemos atualizar esta política. Em caso de mudanças relevantes, notificaremos os usuários no Site.

6. Contato

Dúvidas: magtcoin@gmail.com`,
    terms: `Data de vigência: 01.01.2026

Estes Termos de Uso (“Termos”) regem o acesso e o uso do site https://magtcoin.com
 e serviços relacionados (“Site”). Ao usar o Site, você concorda com estes Termos.

1. Aceitação dos termos

Ao acessar o Site, você confirma que compreende e concorda com todos os Termos.

2. Sem aconselhamento de investimento

O conteúdo do Site é apenas informativo e não constitui aconselhamento financeiro, de investimento, jurídico ou tributário.

3. Riscos

Participar de vendas de tokens blockchain envolve riscos significativos. Você pode perder todos os fundos.

4. Responsabilidades do usuário

Os usuários devem:

estar legalmente autorizados a participar

compreender os riscos das transações blockchain

verificar todas as informações de forma independente

5. Prioridade dos smart contracts

O código dos smart contracts rege as transações. Na máxima extensão permitida por lei, o Site não se responsabiliza pelo comportamento dos smart contracts.

6. Propriedade intelectual

Todo o conteúdo do Site é de nossa propriedade e protegido por lei.

7. Modificações

Podemos atualizar estes Termos a qualquer momento.

8. Lei aplicável

Lei aplicável: República Tcheca (ou país de registro da empresa).

9. Contato

Dúvidas: magtcoin@gmail.com`,
    disclaimer: `As informações fornecidas em https://magtcoin.com
 são apenas para fins informativos gerais e não constituem aconselhamento financeiro, de investimento, jurídico ou tributário.

Você entende e concorda que:

não somos consultores de investimento

os tokens oferecidos no presale apresentam alto risco

você deve realizar sua própria pesquisa (DYOR)

você pode perder todos os fundos

Ao participar da venda de tokens, você aceita todos os riscos.`,
    liquidity: `Bloqueio de liquidez
Após o presale e o listing, os Tokens de Provisão de Liquidez (LP Tokens) serão usados em outros projetos Magic Time.
Isso é feito para uso futuro, visando aumentar a confiança e reduzir o risco de roubo de liquidez.

Participantes do presale

5% do fornecimento total de tokens é alocado para este presale

todos os tokens comprados durante o presale ficam bloqueados a partir da data de início do presale

os tokens permanecem totalmente bloqueados até 2027

após o término do período de bloqueio, os tokens são liberados de forma linear

não mais que 25% do fornecimento total de tokens entrará em circulação no primeiro ano após o desbloqueio`,
  },
  cn: {
    privacy: `最后更新： 01.01.2026

本隐私政策说明当您访问或使用我们的网站 https://magtcoin.com
 及相关服务（“网站”）时，我们如何收集、使用、共享并保护您的信息。

1. 我们收集的信息

a) 个人数据
我们不会收集私钥或助记词（seed phrase）。
我们可能收集：

用于交易的钱包地址

IP 地址以及设备/浏览器数据（通过分析工具）

Cookies 及使用信息

b) 自动收集的数据
我们使用分析工具（例如 Google Analytics）来收集：

页面访问数据

点击数据

会话时长

2. 信息的使用

我们使用您的信息来：

提供并改进我们的服务

分析使用趋势

响应支持请求

确保安全并防止欺诈

3. 信息共享

我们不会出于营销目的出售或与第三方共享个人数据。
在以下情况下我们可能共享数据：

与分析服务提供商

法律要求时

4. 安全

我们采用符合行业标准的安全措施来保护数据。

5. 政策变更

我们可能会更新本政策。如发生重大变更，我们将通过网站通知用户。

6. 联系方式

如有疑问：magtcoin@gmail.com`,
    terms: `生效日期： 01.01.2026

本使用条款（“条款”）适用于您对 https://magtcoin.com
 及相关服务（“网站”）的访问和使用。使用本网站即表示您同意这些条款。

1. 接受条款

访问网站即表示您理解并同意所有条款。

2. 非投资建议

网站内容仅供信息参考，不构成任何财务、投资、法律或税务建议。

3. 风险

参与区块链代币销售存在重大风险，您可能会损失全部资金。

4. 用户责任

用户必须：

合法参与

理解区块链交易风险

独立核实所有信息

5. 智能合约优先

交易以智能合约代码为准。在法律允许的最大范围内，网站不对智能合约的行为负责。

6. 知识产权

网站上的所有内容均归我们所有，并受法律保护。

7. 修改

我们可随时更新这些条款。

8. 适用法律

适用法律：捷克共和国（或公司注册国家）。

9. 联系方式

如有疑问：magtcoin@gmail.com`,
    disclaimer: `https://magtcoin.com
 上提供的信息仅供一般参考，不构成任何财务、投资、法律或税务建议。

您理解并同意：

我们不是投资顾问

预售中提供的代币具有高风险

您应自行研究（DYOR）

您可能会损失全部资金

参与代币销售即表示您接受所有风险。`,
    liquidity: `流动性锁定
在 presale 和上市之后，流动性提供代币（LP Tokens）将用于其他 Magic Time 项目。
此举用于未来用途，以增强信任并降低流动性被盗的风险。

Presale 参与者

总代币供应量的 5% 分配给本次 presale

presale 期间购买的所有代币自 presale 开始日期起被锁定

代币将完全锁定至 2027 年

锁定期结束后，代币将线性释放

解锁后的第一年内，进入流通的代币不超过总供应量的 25%`,
  },
  in: {
    privacy: `अंतिम अपडेट: 01.01.2026

यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट https://magtcoin.com
 और संबंधित सेवाओं (“साइट”) पर जाते हैं या उनके साथ इंटरैक्ट करते हैं, तो हम आपकी जानकारी कैसे एकत्रित, उपयोग, साझा और सुरक्षित करते हैं।

1. हम कौन-सी जानकारी एकत्र करते हैं

a) व्यक्तिगत डेटा
हम प्राइवेट कीज़ या सीड फ़्रेज़ एकत्र नहीं करते।
हम निम्न जानकारी एकत्र कर सकते हैं:

लेनदेन में उपयोग किए गए वॉलेट पते

IP पता और डिवाइस/ब्राउज़र डेटा (एनालिटिक्स के माध्यम से)

कुकीज़ और उपयोग संबंधी जानकारी

b) स्वचालित रूप से एकत्रित डेटा
हम एनालिटिक्स टूल्स (जैसे Google Analytics) का उपयोग करते हैं ताकि एकत्र किया जा सके:

पेज विज़िट डेटा

क्लिक डेटा

सत्र की अवधि

2. जानकारी का उपयोग

हम आपकी जानकारी का उपयोग निम्न उद्देश्यों के लिए करते हैं:

हमारी सेवाएँ प्रदान करने और उन्हें बेहतर बनाने के लिए

उपयोग के रुझानों का विश्लेषण करने के लिए

सपोर्ट अनुरोधों का उत्तर देने के लिए

सुरक्षा और धोखाधड़ी की रोकथाम सुनिश्चित करने के लिए

3. जानकारी साझा करना

हम मार्केटिंग उद्देश्यों के लिए व्यक्तिगत डेटा न तो बेचते हैं और न ही साझा करते हैं।
हम डेटा साझा कर सकते हैं:

एनालिटिक्स प्रदाताओं के साथ

यदि कानून द्वारा आवश्यक हो

4. सुरक्षा

हम डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं।

5. नीति में परिवर्तन

हम इस नीति को अपडेट कर सकते हैं। यदि महत्वपूर्ण परिवर्तन होते हैं, तो हम साइट पर उपयोगकर्ताओं को सूचित करेंगे।

6. संपर्क

प्रश्नों के लिए: magtcoin@gmail.com`,
    terms: `प्रभावी तिथि: 01.01.2026

ये उपयोग की शर्तें (“शर्तें”) https://magtcoin.com
 और संबंधित सेवाओं (“साइट”) के आपके उपयोग को नियंत्रित करती हैं। साइट का उपयोग करके, आप इन शर्तों से सहमत होते हैं।

1. शर्तों की स्वीकृति

साइट तक पहुँचकर, आप पुष्टि करते हैं कि आप सभी शर्तों को समझते और स्वीकार करते हैं।

2. कोई निवेश सलाह नहीं

साइट पर दिया गया कंटेंट केवल सूचना के उद्देश्य से है और यह वित्तीय, निवेश, कानूनी या कर संबंधी सलाह नहीं है।

3. जोखिम

ब्लॉकचेन टोकन बिक्री में भाग लेना उच्च जोखिम से जुड़ा है। आप सभी धन खो सकते हैं।

4. उपयोगकर्ता की ज़िम्मेदारियाँ

उपयोगकर्ताओं को चाहिए कि वे:

कानूनी रूप से भाग लेने के लिए पात्र हों

ब्लॉकचेन लेनदेन के जोखिमों को समझें

सभी जानकारी की स्वतंत्र रूप से पुष्टि करें

5. स्मार्ट कॉन्ट्रैक्ट की प्राथमिकता

लेनदेन स्मार्ट कॉन्ट्रैक्ट कोड द्वारा नियंत्रित होते हैं। कानून द्वारा अनुमत अधिकतम सीमा तक, साइट स्मार्ट कॉन्ट्रैक्ट के व्यवहार के लिए उत्तरदायी नहीं है।

6. बौद्धिक संपदा

साइट की सभी सामग्री हमारी स्वामित्व में है और कानून द्वारा संरक्षित है।

7. संशोधन

हम इन शर्तों को किसी भी समय अपडेट कर सकते हैं।

8. लागू कानून

लागू कानून: चेक गणराज्य (या कंपनी के पंजीकरण का देश)।

9. संपर्क

प्रश्नों के लिए: magtcoin@gmail.com`,
    disclaimer: `https://magtcoin.com
 पर प्रदान की गई जानकारी केवल सामान्य सूचना के लिए है और यह वित्तीय, निवेश, कानूनी या कर सलाह नहीं है।

आप समझते और सहमत हैं कि:

हम निवेश सलाहकार नहीं हैं

प्रीसैल में पेश किए गए टोकन उच्च जोखिम वाले हैं

आपको अपना स्वयं का शोध करना चाहिए (DYOR)

आप सभी धन खो सकते हैं

हमारी टोकन बिक्री में भाग लेकर, आप सभी जोखिमों को स्वीकार करते हैं।`,
    liquidity: `लिक्विडिटी लॉक
प्रीसैल और लिस्टिंग के बाद, लिक्विडिटी प्रोविजन टोकन (LP Tokens) का उपयोग अन्य Magic Time प्रोजेक्ट्स के लिए किया जाएगा।
यह भविष्य के उपयोग के लिए किया जाता है ताकि भरोसा सुनिश्चित किया जा सके और लिक्विडिटी चोरी के जोखिम को कम किया जा सके।

प्रीसैल प्रतिभागी

कुल टोकन आपूर्ति का 5% इस प्रीसैल के लिए आवंटित है

प्रीसैल के दौरान खरीदे गए सभी टोकन प्रीसैल शुरू होने की तारीख से लॉक हो जाते हैं

टोकन पूरी तरह से 2027 तक लॉक रहेंगे

लॉक अवधि समाप्त होने के बाद, टोकन को रैखिक रूप से जारी किया जाएगा

अनलॉक के बाद पहले वर्ष में कुल टोकन आपूर्ति का 25% से अधिक प्रचलन में नहीं आएगा`,
  },
  id: {
    privacy: `Terakhir diperbarui: 01.01.2026

Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, membagikan, dan melindungi informasi Anda ketika Anda mengunjungi atau berinteraksi dengan situs web kami https://magtcoin.com
 dan layanan terkait (“Situs”).

1. Informasi yang Kami Kumpulkan

a) Data pribadi
Kami tidak mengumpulkan private key atau seed phrase.
Kami dapat mengumpulkan:

alamat wallet yang digunakan untuk transaksi

alamat IP serta data perangkat/browser (melalui analitik)

cookies dan informasi penggunaan

b) Data yang dikumpulkan secara otomatis
Kami menggunakan alat analitik (misalnya Google Analytics) untuk mengumpulkan:

data kunjungan halaman

data klik

durasi sesi

2. Penggunaan Informasi

Kami menggunakan informasi Anda untuk:

menyediakan dan meningkatkan layanan kami

menganalisis tren penggunaan

menanggapi permintaan dukungan

memastikan keamanan dan pencegahan penipuan

3. Pembagian Informasi

Kami TIDAK menjual atau membagikan data pribadi kepada pihak ketiga untuk tujuan pemasaran.
Kami dapat membagikan data:

kepada penyedia analitik

jika diwajibkan oleh hukum

4. Keamanan

Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data.

5. Perubahan Kebijakan

Kami dapat memperbarui kebijakan ini. Jika terjadi perubahan material, kami akan memberi tahu pengguna melalui Situs.

6. Kontak

Untuk pertanyaan: magtcoin@gmail.com`,
    terms: `Tanggal berlaku: 01.01.2026

Syarat Penggunaan ini (“Syarat”) mengatur akses dan penggunaan Anda terhadap https://magtcoin.com
 dan layanan terkait (“Situs”). Dengan menggunakan Situs, Anda menyetujui Syarat ini.

1. Penerimaan syarat

Dengan mengakses Situs, Anda menyatakan bahwa Anda memahami dan menyetujui semua Syarat.

2. Tidak ada nasihat investasi

Konten di Situs hanya untuk tujuan informasi dan tidak merupakan nasihat keuangan, investasi, hukum, atau pajak.

3. Risiko

Berpartisipasi dalam penjualan token blockchain melibatkan risiko yang signifikan. Anda dapat kehilangan seluruh dana.

4. Tanggung jawab pengguna

Pengguna harus:

secara hukum diizinkan untuk berpartisipasi

memahami risiko transaksi blockchain

memverifikasi semua data secara mandiri

5. Prioritas smart contract

Kode smart contract mengatur transaksi. Sejauh diizinkan oleh hukum, Situs tidak bertanggung jawab atas perilaku smart contract.

6. Kekayaan intelektual

Seluruh konten Situs adalah milik kami dan dilindungi oleh hukum.

7. Perubahan

Kami dapat memperbarui Syarat ini kapan saja.

8. Hukum yang berlaku

Hukum yang berlaku: Republik Ceko (atau negara tempat perusahaan terdaftar).

9. Kontak

Untuk pertanyaan: magtcoin@gmail.com`,
    disclaimer: `Informasi yang disediakan di https://magtcoin.com
 hanya untuk tujuan informasi umum dan tidak merupakan nasihat keuangan, investasi, hukum, atau pajak.

Anda memahami dan menyetujui bahwa:

kami bukan penasihat investasi

token yang ditawarkan melalui presale memiliki risiko tinggi

Anda harus melakukan riset sendiri (DYOR)

Anda dapat kehilangan seluruh dana

Dengan berpartisipasi dalam penjualan token, Anda menerima semua risiko.`,
    liquidity: `Penguncian likuiditas
Setelah presale dan listing, Liquidity Provision Tokens (LP Tokens) akan digunakan untuk proyek Magic Time lainnya.
Hal ini dilakukan untuk penggunaan di masa depan guna memastikan kepercayaan dan mengurangi risiko pencurian likuiditas.

Peserta presale

5% dari total suplai token dialokasikan untuk presale ini

semua token yang dibeli selama presale dikunci sejak tanggal dimulainya presale

token akan tetap terkunci sepenuhnya hingga 2027

setelah periode penguncian berakhir, token dilepas secara linear

tidak lebih dari 25% dari total suplai token akan masuk ke sirkulasi pada tahun pertama setelah pembukaan kunci`,
  },
  sa: {
    privacy: `آخر تحديث: 01.01.2026

توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا ومشاركتنا وحمايتنا لمعلوماتك عند زيارتك أو تفاعلك مع موقعنا الإلكتروني https://magtcoin.com
 والخدمات المرتبطة به («الموقع»).

1. المعلومات التي نجمعها

أ) البيانات الشخصية
نحن لا نجمع المفاتيح الخاصة أو عبارات الاسترداد (Seed Phrases).
قد نجمع:

عناوين المحافظ المستخدمة في المعاملات

عنوان IP وبيانات الجهاز/المتصفح (عبر أدوات التحليل)

ملفات تعريف الارتباط (Cookies) ومعلومات الاستخدام

ب) البيانات التي يتم جمعها تلقائيًا
نستخدم أدوات تحليل (مثل Google Analytics) لجمع:

بيانات زيارات الصفحات

بيانات النقر

مدة الجلسات

2. استخدام المعلومات

نستخدم معلوماتك من أجل:

تقديم خدماتنا وتحسينها

تحليل اتجاهات الاستخدام

الرد على طلبات الدعم

ضمان الأمان ومنع الاحتيال

3. مشاركة المعلومات

نحن لا نبيع ولا نشارك البيانات الشخصية مع أطراف ثالثة لأغراض تسويقية.
قد نشارك البيانات:

مع مزودي خدمات التحليل

إذا كان ذلك مطلوبًا بموجب القانون

4. الأمان

نطبق إجراءات أمان متوافقة مع معايير الصناعة لحماية البيانات.

5. التغييرات على السياسة

قد نقوم بتحديث هذه السياسة. في حال حدوث تغييرات جوهرية، سنقوم بإخطار المستخدمين عبر الموقع.

6. التواصل

للاستفسارات: magtcoin@gmail.com`,
    terms: `تاريخ السريان: 01.01.2026

تحكم شروط الاستخدام هذه («الشروط») وصولك إلى واستخدامك لموقع https://magtcoin.com
 والخدمات المرتبطة به («الموقع»). باستخدامك للموقع، فإنك توافق على هذه الشروط.

1. قبول الشروط

بدخولك إلى الموقع، فإنك تقر بأنك تفهم وتوافق على جميع الشروط.

2. عدم تقديم نصائح استثمارية

المحتوى الموجود على الموقع لأغراض معلوماتية فقط ولا يشكل نصيحة مالية أو استثمارية أو قانونية أو ضريبية.

3. المخاطر

المشاركة في مبيعات توكنات البلوكتشين تنطوي على مخاطر كبيرة. قد تخسر جميع أموالك.

4. مسؤوليات المستخدم

يجب على المستخدمين:

أن يكونوا مؤهلين قانونيًا للمشاركة

فهم مخاطر معاملات البلوكتشين

التحقق من جميع المعلومات بشكل مستقل

5. أولوية العقود الذكية

تحكم الشيفرة البرمجية للعقود الذكية المعاملات. وإلى أقصى حد يسمح به القانون، لا يتحمل الموقع مسؤولية سلوك العقود الذكية.

6. الملكية الفكرية

جميع محتويات الموقع مملوكة لنا ومحمية بموجب القانون.

7. التعديلات

يجوز لنا تحديث هذه الشروط في أي وقت.

8. القانون المعمول به

القانون المعمول به: جمهورية التشيك (أو بلد تسجيل الشركة).

9. التواصل

للاستفسارات: magtcoin@gmail.com`,
    disclaimer: `المعلومات المقدمة على https://magtcoin.com
 هي لأغراض معلوماتية عامة فقط ولا تشكل نصيحة مالية أو استثمارية أو قانونية أو ضريبية.

أنت تفهم وتوافق على أن:

نحن لسنا مستشارين استثماريين

التوكنات المعروضة في البيع المسبق عالية المخاطر

يجب عليك إجراء بحثك الخاص (DYOR)

قد تخسر جميع أموالك

بمشاركتك في بيع التوكنات، فإنك تقبل جميع المخاطر.`,
    liquidity: `قفل السيولة
بعد انتهاء البيع المسبق والإدراج، سيتم استخدام توكنات توفير السيولة (LP Tokens) في مشاريع Magic Time الأخرى.
يتم ذلك للاستخدام المستقبلي بهدف تعزيز الثقة وتقليل مخاطر سرقة السيولة.

مشاركو البيع المسبق

تم تخصيص 5٪ من إجمالي المعروض من التوكنات لهذا البيع المسبق

يتم قفل جميع التوكنات التي تم شراؤها خلال البيع المسبق بدءًا من تاريخ بدء البيع المسبق

ستظل التوكنات مقفلة بالكامل حتى عام 2027

بعد انتهاء فترة القفل، سيتم إطلاق التوكنات بشكل خطي

لن يدخل أكثر من 25٪ من إجمالي المعروض من التوكنات إلى التداول خلال السنة الأولى بعد فك القفل`,
  },
  bd: {
    privacy: `সর্বশেষ আপডেট: 01.01.2026

এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আপনি যখন আমাদের ওয়েবসাইট https://magtcoin.com
 এবং সংশ্লিষ্ট সেবাসমূহ (“সাইট”) ভিজিট বা ব্যবহার করেন, তখন আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, শেয়ার এবং সুরক্ষিত করি।

1. আমরা যে তথ্য সংগ্রহ করি

ক) ব্যক্তিগত তথ্য
আমরা প্রাইভেট কী বা সিড ফ্রেজ সংগ্রহ করি না।
আমরা সংগ্রহ করতে পারি:

লেনদেনের জন্য ব্যবহৃত ওয়ালেট ঠিকানা

IP ঠিকানা এবং ডিভাইস/ব্রাউজার সংক্রান্ত তথ্য (অ্যানালিটিক্সের মাধ্যমে)

কুকিজ এবং ব্যবহার সম্পর্কিত তথ্য

খ) স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য
আমরা অ্যানালিটিক্স টুল (যেমন Google Analytics) ব্যবহার করে সংগ্রহ করি:

পেজ ভিজিট ডেটা

ক্লিক ডেটা

সেশনের সময়কাল

2. তথ্যের ব্যবহার

আমরা আপনার তথ্য ব্যবহার করি:

আমাদের সেবা প্রদান ও উন্নত করার জন্য

ব্যবহার প্রবণতা বিশ্লেষণের জন্য

সাপোর্ট অনুরোধের উত্তর দেওয়ার জন্য

নিরাপত্তা নিশ্চিত করা এবং জালিয়াতি প্রতিরোধের জন্য

3. তথ্য শেয়ারিং

আমরা মার্কেটিং উদ্দেশ্যে তৃতীয় পক্ষের কাছে ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করি না।
আমরা তথ্য শেয়ার করতে পারি:

অ্যানালিটিক্স প্রদানকারীদের সাথে

আইন অনুযায়ী প্রয়োজন হলে

4. নিরাপত্তা

ডেটা সুরক্ষার জন্য আমরা শিল্পমান অনুযায়ী নিরাপত্তা ব্যবস্থা গ্রহণ করি।

5. নীতির পরিবর্তন

আমরা এই নীতি আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তন হলে, আমরা সাইটে ব্যবহারকারীদের জানাব।

6. যোগাযোগ

প্রশ্নের জন্য: magtcoin@gmail.com`,
    terms: `কার্যকর তারিখ: 01.01.2026

এই ব্যবহারের শর্তাবলি (“শর্তাবলি”) https://magtcoin.com
 এবং সংশ্লিষ্ট সেবাসমূহ (“সাইট”) ব্যবহারের নিয়ম নির্ধারণ করে। সাইট ব্যবহার করে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন।

1. শর্তাবলির গ্রহণযোগ্যতা

সাইটে প্রবেশের মাধ্যমে আপনি নিশ্চিত করেন যে আপনি সমস্ত শর্ত বুঝেছেন এবং তাতে সম্মত।

2. বিনিয়োগ পরামর্শ নয়

সাইটে থাকা কন্টেন্ট শুধুমাত্র তথ্যের জন্য এবং এটি আর্থিক, বিনিয়োগ, আইনগত বা কর পরামর্শ নয়।

3. ঝুঁকি

ব্লকচেইন টোকেন বিক্রয়ে অংশগ্রহণ উচ্চ ঝুঁকিপূর্ণ। আপনি আপনার সমস্ত অর্থ হারাতে পারেন।

4. ব্যবহারকারীর দায়িত্ব

ব্যবহারকারীদের অবশ্যই:

আইনগতভাবে অংশগ্রহণের যোগ্য হতে হবে

ব্লকচেইন লেনদেনের ঝুঁকি বুঝতে হবে

সমস্ত তথ্য স্বাধীনভাবে যাচাই করতে হবে

5. স্মার্ট কন্ট্রাক্টের অগ্রাধিকার

লেনদেন স্মার্ট কন্ট্রাক্ট কোড দ্বারা নিয়ন্ত্রিত হয়। আইন দ্বারা অনুমোদিত সর্বোচ্চ সীমার মধ্যে, সাইট স্মার্ট কন্ট্রাক্টের আচরণের জন্য দায়ী নয়।

6. মেধাস্বত্ব

সাইটের সমস্ত কন্টেন্ট আমাদের মালিকানাধীন এবং আইন দ্বারা সুরক্ষিত।

7. পরিবর্তন

আমরা যেকোনো সময় এই শর্তাবলি আপডেট করতে পারি।

8. প্রযোজ্য আইন

প্রযোজ্য আইন: চেক প্রজাতন্ত্র (অথবা কোম্পানির নিবন্ধনের দেশ)।

9. যোগাযোগ

প্রশ্নের জন্য: magtcoin@gmail.com`,
    disclaimer: `https://magtcoin.com-এ
 প্রদত্ত তথ্য শুধুমাত্র সাধারণ তথ্যের উদ্দেশ্যে এবং এটি আর্থিক, বিনিয়োগ, আইনগত বা কর পরামর্শ নয়।

আপনি বুঝেন এবং সম্মত হন যে:

আমরা বিনিয়োগ উপদেষ্টা নই

প্রিসেলে অফার করা টোকেনগুলো উচ্চ ঝুঁকিপূর্ণ

আপনাকে নিজস্ব গবেষণা করতে হবে (DYOR)

আপনি আপনার সমস্ত অর্থ হারাতে পারেন

টোকেন বিক্রয়ে অংশগ্রহণের মাধ্যমে আপনি সকল ঝুঁকি গ্রহণ করেন।`,
    liquidity: `লিকুইডিটি লক
প্রিসেল এবং লিস্টিংয়ের পর, লিকুইডিটি প্রোভিশন টোকেন (LP Tokens) অন্যান্য Magic Time প্রকল্পে ব্যবহৃত হবে।
এটি ভবিষ্যৎ ব্যবহারের জন্য করা হয়, যাতে বিশ্বাস নিশ্চিত হয় এবং লিকুইডিটি চুরির ঝুঁকি কমে।

প্রিসেল অংশগ্রহণকারীরা

মোট টোকেন সরবরাহের 5% এই প্রিসেলের জন্য বরাদ্দ

প্রিসেল চলাকালীন কেনা সমস্ত টোকেন প্রিসেল শুরুর তারিখ থেকে লক থাকবে

টোকেন সম্পূর্ণভাবে ২০২৭ সাল পর্যন্ত লক থাকবে

লক সময় শেষ হলে টোকেন ধাপে ধাপে (লিনিয়ারভাবে) মুক্ত করা হবে

আনলকের পর প্রথম বছরে মোট টোকেন সরবরাহের 25% এর বেশি বাজারে আসবে না`,
  },
};
export const UI_TEXT: Record<LangCode, Record<string, string>> = {
  "en": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Claim",
    "app__4": "Claim",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Your MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "Referral MAGT",
    "app__21": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__22": "Connect wallet to enable claim",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Buy",
    "header__4": "FAQ",
    "header__5": "Privacy Policy",
    "header__6": "Social",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Connect Wallet",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Buy",
    "presale_widget__2": "TON purchase with BUY payload (opcode) + ref. If ref is missing — ref = your wallet.",
    "presale_widget__3": "Buy with TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Amount (TON)",
    "presale_widget__6": "Sending…",
    "presale_widget__7": "Buy with TON",
    "presale_widget__8": "Connect wallet",
    "presale_widget__9": "Connect wallet",
    "presale_widget__10": "Please connect your wallet first",
    "presale_widget__11": "Enter a TON amount greater than 0",
    "presale_widget__12": "Failed to build BUY payload",
    "presale_widget__13": "✅ BUY transaction sent (refresh your balance in 3–10 seconds)",
    "presale_widget__14": "Transaction error",
    "presale_widget__15": "Contract:",
    "presale_progress__1": "Presale Progress",
    "presale_progress__2": "Round",
    "presale_progress__3": "Sold this round",
    "presale_progress__4": "Sold total",
    "presale_progress__5": "Raised",
    "presale_progress__6": "Next round price",
    "presale_progress__7": "Current price",
    "presale_progress__8": "Sold",
    "presale_progress__9": "TOTAL SOLD",
    "projects__1": "Our Projects",
    "projects__2": "Launched and upcoming projects of the MAGIC TIME ecosystem",
    "projects__3": "Raised",
    "projects__4": "Roadmap",
    "projects__5": "All projects",
    "projects__6": "Coming soon",
    "projects__7": "Ecosystem",
    "referral__1": "Copy referral link",
    "referral__2": "Copied!",
    "referral__3": "Open your referral link (or press Copy referral link) and connect wallet",
    "calculator__1": "Calculator",
    "calculator__2": "Enter TON amount",
    "calculator__3": "You get",
    "calculator__4": "Current round",
    "calculator__5": "Price",
    "calculator__6": "Min purchase",
    "calculator__7": "Max purchase",
    "calculator__8": "Connect wallet to calculate",
    "trust__1": "Why trust us",
    "trust__2": "On-chain smart contract",
    "trust__3": "Transparency",
    "trust__4": "Fair rounds",
    "trust__5": "Fast & cheap TON",
    "trust__6": "No manual intervention",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Team (locked)",
    "tokenomics__2": "Total supply",
    "tokenomics__3": "Presale",
    "tokenomics__4": "Liquidity",
    "tokenomics__5": "Team",
    "tokenomics__6": "Marketing",
    "tokenomics__7": "Other projects",
    "roadmap__1": "Roadmap",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Presale launch",
    "roadmap__7": "Listing",
    "roadmap__8": "Staking",
    "roadmap__9": "Ecosystem expansion",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Smart contract on TON",
    "trust__1_text": "Fully on-chain, immutable and verifiable on The Open Network.",
    "trust__2_title": "Open-source contract (GitHub)",
    "trust__2_text": "Source code is public and can be reviewed by anyone.",
    "trust__3_title": "No mint after presale",
    "trust__3_text": "Fixed supply. No hidden minting or inflation.",
    "trust__4_title": "Liquidity lock (TBA)",
    "trust__4_text": "Liquidity will be locked with transparent conditions.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Presale & Community Growth",
    "roadmap__q2": "DEX Listing & Liquidity Launch",
    "roadmap__q3": "Product Launch & Adoption",
    "roadmap__q4": "Ecosystem Expansion",
    "app__claim_gas_note": "Claim sends ~0.35 TON gas (testnet/mainnet depends on network).",
    "app__claim": "Claim",
    "app__your_magt": "Your MAGT",
    "app__referral_magt": "Referral MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Roadmap",
    "tokenomics_title": "Tokenomics",
    "total_supply": "Total supply",
    "presale": "Presale",
    "liquidity": "Liquidity",
    "team": "Team",
    "marketing": "Marketing",
    "other": "Other projects",
    "tokenomics__locked_suffix": "(locked)",
    "app__network": "Network",
    "app__ref_bonus": "Referral bonus",
    "app__token": "Token",
    "buy__title": "Buy MAGT",
    "buy__subtitle": "Pay in TON · Instant on-chain",
    "buy__pay_label": "You pay (TON)",
    "buy__receive_label": "You receive (MAGT)",
    "buy__btn_connect": "Connect wallet",
    "buy__btn_processing": "Processing…",
    "buy__btn_buy": "Buy MAGT",
    "buy__status_confirming": "Confirm the transaction in your wallet…",
    "buy__status_sent": "Transaction sent!",
    "buy__status_failed": "Transaction failed.",
    "buy__try_again": "Try again",
    "buy__min_error": "Minimum is 1 TON",
    "calc__price": "Price",
    "calc__price_unit": "price MAGT",
    "presale_progress__total_presale": "Total presale",
    "copy_ref": "Copy referral link",
    "copied": "Copied",
    "ref__need_wallet": "Connect wallet to copy referral link",
  
  
  },
  "uk": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Отримати",
    "app__4": "Отримати",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Ваш MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "Реферальний MAGT",
    "app__21": "Відкрийте реферальне посилання (або натисніть Copy referral link) і підключіть гаманець",
    "app__22": "Підключіть гаманець, щоб увімкнути отримання",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Купити",
    "header__4": "FAQ",
    "header__5": "Політика конфіденційності",
    "header__6": "Соцмережі",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Підключити гаманець",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Купити",
    "presale_widget__2": "Покупка TON з payload BUY (opcode) + ref. Якщо ref відсутній — ref = ваш гаманець.",
    "presale_widget__3": "Купити за TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Сума (TON)",
    "presale_widget__6": "Відправлення…",
    "presale_widget__7": "Купити за TON",
    "presale_widget__8": "Підключити гаманець",
    "presale_widget__9": "Підключити гаманець",
    "presale_widget__10": "Будь ласка, спочатку підключіть гаманець",
    "presale_widget__11": "Введіть суму TON більше 0",
    "presale_widget__12": "Не вдалося зібрати BUY payload",
    "presale_widget__13": "✅ BUY транзакцію відправлено (оновіть баланс через 3–10 секунд)",
    "presale_widget__14": "Помилка транзакції",
    "presale_widget__15": "Контракт:",
    "presale_progress__1": "Прогрес пресейлу",
    "presale_progress__2": "Раунд",
    "presale_progress__3": "Продано в цьому раунді",
    "presale_progress__4": "Всього продано",
    "presale_progress__5": "Залучено",
    "presale_progress__6": "Ціна наступного раунду",
    "presale_progress__7": "Поточна ціна",
    "presale_progress__8": "Продано",
    "presale_progress__9": "ВСЬОГО ПРОДАНО",
    "projects__1": "Наші проєкти",
    "projects__2": "Запущені та майбутні проєкти екосистеми MAGIC TIME",
    "projects__3": "Залучено",
    "projects__4": "Дорожня карта",
    "projects__5": "Усі проєкти",
    "projects__6": "Скоро",
    "projects__7": "Екосистема",
    "referral__1": "Скопіювати реферальне посилання",
    "referral__2": "Скопійовано!",
    "referral__3": "Відкрийте реферальне посилання (або натисніть Copy referral link) і підключіть гаманець",
    "calculator__1": "Калькулятор",
    "calculator__2": "Введіть суму TON",
    "calculator__3": "Ви отримаєте",
    "calculator__4": "Поточний раунд",
    "calculator__5": "Ціна",
    "calculator__6": "Мінімальна покупка",
    "calculator__7": "Максимальна покупка",
    "calculator__8": "Підключіть гаманець для розрахунку",
    "trust__1": "Чому нам можна довіряти",
    "trust__2": "Ончейн смартконтракт",
    "trust__3": "Прозорість",
    "trust__4": "Чесні раунди",
    "trust__5": "Швидкий і дешевий TON",
    "trust__6": "Без ручного втручання",
    "tokenomics__1": "Токеноміка",
    "tokenomics__team_locked": "Команда (заблоковано)",
    "tokenomics__2": "Загальна пропозиція",
    "tokenomics__3": "Пресейл",
    "tokenomics__4": "Ліквідність",
    "tokenomics__5": "Команда",
    "tokenomics__6": "Маркетинг",
    "tokenomics__7": "Інші проєкти",
    "roadmap__1": "Дорожня карта",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Запуск пресейлу",
    "roadmap__7": "Лістинг",
    "roadmap__8": "Стейкінг",
    "roadmap__9": "Розширення екосистеми",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Смартконтракт у мережі TON",
    "trust__1_text": "Повністю ончейн, незмінний і перевіряється в мережі TON.",
    "trust__2_title": "Open-source контракт (GitHub)",
    "trust__2_text": "Вихідний код відкритий та доступний для перевірки.",
    "trust__3_title": "Без мінту після пресейлу",
    "trust__3_text": "Фіксована емісія. Без прихованого мінтингу.",
    "trust__4_title": "Лок ліквідності (TBA)",
    "trust__4_text": "Ліквідність буде залочена на прозорих умовах.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Пресейл та зростання спільноти",
    "roadmap__q2": "DEX‑лістинг і запуск ліквідності",
    "roadmap__q3": "Запуск продукту та залучення користувачів",
    "roadmap__q4": "Розширення екосистеми",
    "app__claim_gas_note": "Отримання надсилає ~0.35 TON як gas (testnet/mainnet залежить від мережі).",
    "app__claim": "Отримати",
    "app__your_magt": "Твій MAGT",
    "app__referral_magt": "Реферальний MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Дорожня карта",
    "tokenomics_title": "Токеноміка",
    "total_supply": "Загальна пропозиція",
    "presale": "Пресейл",
    "liquidity": "Ліквідність",
    "team": "Команда",
    "marketing": "Маркетинг",
    "other": "Інші проєкти",
    "tokenomics__locked_suffix": "(заблоковано)",
    "app__network": "Мережа",
    "app__ref_bonus": "Реферальний бонус",
    "app__token": "Токен",
    "buy__title": "Купити MAGT",
    "buy__subtitle": "Оплата в TON · Миттєво он-чейн",
    "buy__pay_label": "Ви платите (TON)",
    "buy__receive_label": "Ви отримуєте (MAGT)",
    "buy__btn_connect": "Підключити гаманець",
    "buy__btn_processing": "Обробка…",
    "buy__btn_buy": "Купити MAGT",
    "buy__status_confirming": "Підтвердіть транзакцію у гаманці…",
    "buy__status_sent": "Транзакцію відправлено!",
    "buy__status_failed": "Транзакція не вдалася.",
    "buy__try_again": "Спробувати ще раз",
    "buy__min_error": "Мінімум — 1 TON",
    "calc__price": "Ціна",
    "calc__price_unit": "ціна MAGT",
    "presale_progress__total_presale": "Всього пресейл",
    "copy_ref": "Скопіювати реферальне посилання",
    "copied": "Скопійовано",
    "ref__need_wallet": "Підключіть гаманець, щоб скопіювати реферальне посилання",
  
  
  },
  "ru": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Получить",
    "app__4": "Получить",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Ваш MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "Реферальный MAGT",
    "app__21": "Откройте реферальную ссылку (или нажмите Copy referral link) и подключите кошелёк",
    "app__22": "Подключите кошелёк, чтобы включить получение",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Купить",
    "header__4": "FAQ",
    "header__5": "Политика конфиденциальности",
    "header__6": "Соцсети",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Подключить кошелёк",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Купить",
    "presale_widget__2": "Покупка TON с payload BUY (opcode) + ref. Если ref отсутствует — ref = ваш кошелёк.",
    "presale_widget__3": "Купить за TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Сумма (TON)",
    "presale_widget__6": "Отправка…",
    "presale_widget__7": "Купить за TON",
    "presale_widget__8": "Подключить кошелёк",
    "presale_widget__9": "Подключить кошелёк",
    "presale_widget__10": "Пожалуйста, сначала подключите кошелёк",
    "presale_widget__11": "Введите сумму TON больше 0",
    "presale_widget__12": "Не удалось собрать BUY payload",
    "presale_widget__13": "✅ BUY транзакция отправлена (обновите баланс через 3–10 секунд)",
    "presale_widget__14": "Ошибка транзакции",
    "presale_widget__15": "Контракт:",
    "presale_progress__1": "Прогресс пресейла",
    "presale_progress__2": "Раунд",
    "presale_progress__3": "Продано в этом раунде",
    "presale_progress__4": "Всего продано",
    "presale_progress__5": "Собрано",
    "presale_progress__6": "Цена следующего раунда",
    "presale_progress__7": "Текущая цена",
    "presale_progress__8": "Продано",
    "presale_progress__9": "ВСЕГО ПРОДАНО",
    "projects__1": "Наши проекты",
    "projects__2": "Запущенные и будущие проекты экосистемы MAGIC TIME",
    "projects__3": "Собрано",
    "projects__4": "Дорожная карта",
    "projects__5": "Все проекты",
    "projects__6": "Скоро",
    "projects__7": "Экосистема",
    "referral__1": "Скопировать реферальную ссылку",
    "referral__2": "Скопировано!",
    "referral__3": "Откройте реферальную ссылку (или нажмите Copy referral link) и подключите кошелёк",
    "calculator__1": "Калькулятор",
    "calculator__2": "Введите сумму TON",
    "calculator__3": "Вы получите",
    "calculator__4": "Текущий раунд",
    "calculator__5": "Цена",
    "calculator__6": "Минимальная покупка",
    "calculator__7": "Максимальная покупка",
    "calculator__8": "Подключите кошелёк для расчёта",
    "trust__1": "Почему нам можно доверять",
    "trust__2": "Ончейн смарт-контракт",
    "trust__3": "Прозрачность",
    "trust__4": "Честные раунды",
    "trust__5": "Быстрый и дешёвый TON",
    "trust__6": "Без ручного вмешательства",
    "tokenomics__1": "Токеномика",
    "tokenomics__team_locked": "Команда (заблокировано)",
    "tokenomics__2": "Общее предложение",
    "tokenomics__3": "Пресейл",
    "tokenomics__4": "Ликвидность",
    "tokenomics__5": "Команда",
    "tokenomics__6": "Маркетинг",
    "tokenomics__7": "Другие проекты",
    "roadmap__1": "Дорожная карта",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Запуск пресейла",
    "roadmap__7": "Листинг",
    "roadmap__8": "Стейкинг",
    "roadmap__9": "Расширение экосистемы",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Смарт-контракт в сети TON",
    "trust__1_text": "Полностью ончейн, неизменяемый и проверяемый.",
    "trust__2_title": "Open-source контракт (GitHub)",
    "trust__2_text": "Исходный код открыт для публичной проверки.",
    "trust__3_title": "Без минта после пресейла",
    "trust__3_text": "Фиксированное предложение без скрытой эмиссии.",
    "trust__4_title": "Лок ликвидности (TBA)",
    "trust__4_text": "Ликвидность будет заблокирована на прозрачных условиях.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Пресейл и рост сообщества",
    "roadmap__q2": "DEX‑листинг и запуск ликвидности",
    "roadmap__q3": "Запуск продукта и принятие рынком",
    "roadmap__q4": "Расширение экосистемы",
    "app__claim_gas_note": "Получение отправляет ~0.35 TON как gas (testnet/mainnet зависит от сети).",
    "app__claim": "Забрать",
    "app__your_magt": "Твой MAGT",
    "app__referral_magt": "Реферальный MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Дорожная карта",
    "tokenomics_title": "Токеномика",
    "total_supply": "Общее предложение",
    "presale": "Пресейл",
    "liquidity": "Ликвидность",
    "team": "Команда",
    "marketing": "Маркетинг",
    "other": "Другие проекты",
    "tokenomics__locked_suffix": "(заблокировано)",
    "app__network": "Сеть",
    "app__ref_bonus": "Реферальный бонус",
    "app__token": "Токен",
    "buy__title": "Купить MAGT",
    "buy__subtitle": "Оплата в TON · Мгновенно он-чейн",
    "buy__pay_label": "Вы платите (TON)",
    "buy__receive_label": "Вы получаете (MAGT)",
    "buy__btn_connect": "Подключить кошелёк",
    "buy__btn_processing": "Обработка…",
    "buy__btn_buy": "Купить MAGT",
    "buy__status_confirming": "Подтвердите транзакцию в кошельке…",
    "buy__status_sent": "Транзакция отправлена!",
    "buy__status_failed": "Транзакция не удалась.",
    "buy__try_again": "Попробовать снова",
    "buy__min_error": "Минимум — 1 TON",
    "calc__price": "Цена",
    "calc__price_unit": "цена MAGT",
    "presale_progress__total_presale": "Всего пресейл",
    "copy_ref": "Скопировать реферальную ссылку",
    "copied": "Скопировано",
    "ref__need_wallet": "Подключите кошелёк, чтобы скопировать реферальную ссылку",
  
  
  },
  "es": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Reclamar",
    "app__4": "Reclamar",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Tu MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "MAGT por referidos",
    "app__21": "Abre tu enlace de referido (o pulsa Copy referral link) y conecta tu wallet",
    "app__22": "Conecta la wallet para habilitar el reclamo",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Comprar",
    "header__4": "Preguntas",
    "header__5": "Política de privacidad",
    "header__6": "Social",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Conectar Wallet",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Comprar",
    "presale_widget__2": "Compra con TON usando payload BUY (opcode) + ref. Si no hay ref — ref = tu wallet.",
    "presale_widget__3": "Comprar con TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Cantidad (TON)",
    "presale_widget__6": "Enviando…",
    "presale_widget__7": "Comprar con TON",
    "presale_widget__8": "Conectar wallet",
    "presale_widget__9": "Conectar wallet",
    "presale_widget__10": "Por favor, conecta tu wallet primero",
    "presale_widget__11": "Introduce una cantidad de TON mayor que 0",
    "presale_widget__12": "No se pudo construir el payload BUY",
    "presale_widget__13": "✅ Transacción BUY enviada (actualiza tu balance en 3–10 segundos)",
    "presale_widget__14": "Error de transacción",
    "presale_widget__15": "Contrato:",
    "presale_progress__1": "Progreso del presale",
    "presale_progress__2": "Ronda",
    "presale_progress__3": "Vendido en esta ronda",
    "presale_progress__4": "Total vendido",
    "presale_progress__5": "Recaudado",
    "presale_progress__6": "Precio de la próxima ronda",
    "presale_progress__7": "Precio actual",
    "presale_progress__8": "Vendido",
    "presale_progress__9": "TOTAL VENDIDO",
    "projects__1": "Nuestros proyectos",
    "projects__2": "Proyectos lanzados y próximos del ecosistema MAGIC TIME",
    "projects__3": "Recaudado",
    "projects__4": "Hoja de ruta",
    "projects__5": "Todos los proyectos",
    "projects__6": "Próximamente",
    "projects__7": "Ecosistema",
    "referral__1": "Copiar enlace de referido",
    "referral__2": "¡Copiado!",
    "referral__3": "Abre tu enlace de referido (o pulsa Copy referral link) y conecta tu wallet",
    "calculator__1": "Calculadora",
    "calculator__2": "Introduce la cantidad de TON",
    "calculator__3": "Recibes",
    "calculator__4": "Ronda actual",
    "calculator__5": "Precio",
    "calculator__6": "Compra mínima",
    "calculator__7": "Compra máxima",
    "calculator__8": "Conecta la wallet para calcular",
    "trust__1": "Por qué confiar en nosotros",
    "trust__2": "Smart contract on-chain",
    "trust__3": "Transparencia",
    "trust__4": "Rondas justas",
    "trust__5": "TON rápido y barato",
    "trust__6": "Sin intervención manual",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Equipo (bloqueado)",
    "tokenomics__2": "Suministro total",
    "tokenomics__3": "Presale",
    "tokenomics__4": "Liquidez",
    "tokenomics__5": "Equipo",
    "tokenomics__6": "Marketing",
    "tokenomics__7": "Otros proyectos",
    "roadmap__1": "Hoja de ruta",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Lanzamiento del presale",
    "roadmap__7": "Listado",
    "roadmap__8": "Staking",
    "roadmap__9": "Expansión del ecosistema",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Contrato inteligente en TON",
    "trust__1_text": "Totalmente on-chain, inmutable y verificable.",
    "trust__2_title": "Contrato open-source (GitHub)",
    "trust__2_text": "Código público disponible para revisión.",
    "trust__3_title": "Sin mint después de la preventa",
    "trust__3_text": "Suministro fijo sin inflación oculta.",
    "trust__4_title": "Bloqueo de liquidez (TBA)",
    "trust__4_text": "Liquidez bloqueada con condiciones transparentes.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Preventa y crecimiento de la comunidad",
    "roadmap__q2": "Listado DEX y lanzamiento de liquidez",
    "roadmap__q3": "Lanzamiento del producto y adopción",
    "roadmap__q4": "Expansión del ecosistema",
    "app__claim_gas_note": "El claim envía ~0.35 TON como gas (testnet/mainnet depende de la red).",
    "app__claim": "Reclamar",
    "app__your_magt": "Tu MAGT",
    "app__referral_magt": "MAGT por referidos",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Hoja de ruta",
    "tokenomics_title": "Tokenomics",
    "total_supply": "Suministro total",
    "presale": "Preventa",
    "liquidity": "Liquidez",
    "team": "Equipo",
    "marketing": "Marketing",
    "other": "Otros proyectos",
    "tokenomics__locked_suffix": "(bloqueado)",
    "app__network": "Red",
    "app__ref_bonus": "Bono por referidos",
    "app__token": "Token",
    "buy__title": "Comprar MAGT",
    "buy__subtitle": "Paga en TON · Instantáneo on-chain",
    "buy__pay_label": "Pagas (TON)",
    "buy__receive_label": "Recibes (MAGT)",
    "buy__btn_connect": "Conectar billetera",
    "buy__btn_processing": "Procesando…",
    "buy__btn_buy": "Comprar MAGT",
    "buy__status_confirming": "Confirma la transacción en tu billetera…",
    "buy__status_sent": "¡Transacción enviada!",
    "buy__status_failed": "Falló la transacción.",
    "buy__try_again": "Intentar de nuevo",
    "buy__min_error": "Mínimo: 1 TON",
    "calc__price": "Precio",
    "calc__price_unit": "precio MAGT",
    "presale_progress__total_presale": "Preventа total",
    "copy_ref": "Copiar enlace de referido",
    "copied": "Copiado",
    "ref__need_wallet": "Conecta la billetera para copiar el enlace de referido",
  
  
  },
  "fr": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Réclamer",
    "app__4": "Réclamer",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Votre MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "MAGT de parrainage",
    "app__21": "Ouvrez votre lien de parrainage (ou appuyez sur Copy referral link) et connectez le wallet",
    "app__22": "Connectez le wallet pour activer la réclamation",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Acheter",
    "header__4": "FAQ",
    "header__5": "Politique de confidentialité",
    "header__6": "Réseaux",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Connecter le wallet",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Acheter",
    "presale_widget__2": "Achat de TON avec payload BUY (opcode) + ref. Si ref est absent — ref = votre wallet.",
    "presale_widget__3": "Acheter avec TON",
    "presale_widget__4": "Payload :",
    "presale_widget__5": "Montant (TON)",
    "presale_widget__6": "Envoi…",
    "presale_widget__7": "Acheter avec TON",
    "presale_widget__8": "Connecter le wallet",
    "presale_widget__9": "Connecter le wallet",
    "presale_widget__10": "Veuillez d’abord connecter votre wallet",
    "presale_widget__11": "Entrez un montant TON supérieur à 0",
    "presale_widget__12": "Échec de la création du payload BUY",
    "presale_widget__13": "✅ Transaction BUY envoyée (actualisez le solde dans 3–10 secondes)",
    "presale_widget__14": "Erreur de transaction",
    "presale_widget__15": "Contrat :",
    "presale_progress__1": "Progression du presale",
    "presale_progress__2": "Round",
    "presale_progress__3": "Vendu dans ce round",
    "presale_progress__4": "Vendu au total",
    "presale_progress__5": "Collecté",
    "presale_progress__6": "Prix du prochain round",
    "presale_progress__7": "Prix actuel",
    "presale_progress__8": "Vendu",
    "presale_progress__9": "TOTAL VENDU",
    "projects__1": "Nos projets",
    "projects__2": "Projets lancés et à venir de l’écosystème MAGIC TIME",
    "projects__3": "Collecté",
    "projects__4": "Feuille de route",
    "projects__5": "Tous les projets",
    "projects__6": "Bientôt disponible",
    "projects__7": "Écosystème",
    "referral__1": "Copier le lien de parrainage",
    "referral__2": "Copié !",
    "referral__3": "Ouvrez votre lien de parrainage (ou appuyez sur Copy referral link) et connectez le wallet",
    "calculator__1": "Calculateur",
    "calculator__2": "Entrez le montant TON",
    "calculator__3": "Vous recevez",
    "calculator__4": "Round actuel",
    "calculator__5": "Prix",
    "calculator__6": "Achat minimum",
    "calculator__7": "Achat maximum",
    "calculator__8": "Connectez le wallet pour calculer",
    "trust__1": "Pourquoi nous faire confiance",
    "trust__2": "Smart contract on-chain",
    "trust__3": "Transparence",
    "trust__4": "Rounds équitables",
    "trust__5": "TON rapide et peu coûteux",
    "trust__6": "Aucune intervention manuelle",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Équipe (verrouillée)",
    "tokenomics__2": "Offre totale",
    "tokenomics__3": "Presale",
    "tokenomics__4": "Liquidité",
    "tokenomics__5": "Équipe",
    "tokenomics__6": "Marketing",
    "tokenomics__7": "Autres projets",
    "roadmap__1": "Feuille de route",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Lancement du presale",
    "roadmap__7": "Listing",
    "roadmap__8": "Staking",
    "roadmap__9": "Expansion de l’écosystème",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Smart contract sur TON",
    "trust__1_text": "Entièrement on-chain, immuable et vérifiable.",
    "trust__2_title": "Contrat open-source (GitHub)",
    "trust__2_text": "Code source public et auditable.",
    "trust__3_title": "Aucun mint après la prévente",
    "trust__3_text": "Offre fixe sans inflation cachée.",
    "trust__4_title": "Blocage de liquidité (TBA)",
    "trust__4_text": "Liquidité verrouillée avec conditions transparentes.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Prévente et croissance de la communauté",
    "roadmap__q2": "Listing DEX et lancement de la liquidité",
    "roadmap__q3": "Lancement du produit et adoption",
    "roadmap__q4": "Expansion de l’écosystème",
    "app__claim_gas_note": "Le claim envoie ~0.35 TON en frais (testnet/mainnet dépend du réseau).",
    "app__claim": "Réclamer",
    "app__your_magt": "Votre MAGT",
    "app__referral_magt": "MAGT de parrainage",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Feuille de route",
    "tokenomics_title": "Tokenomics",
    "total_supply": "Offre totale",
    "presale": "Prévente",
    "liquidity": "Liquidité",
    "team": "Équipe",
    "marketing": "Marketing",
    "other": "Autres projets",
    "tokenomics__locked_suffix": "(verrouillée)",
    "app__network": "Réseau",
    "app__ref_bonus": "Bonus de parrainage",
    "app__token": "Token",
    "buy__title": "Acheter MAGT",
    "buy__subtitle": "Payer en TON · Instantané on-chain",
    "buy__pay_label": "Vous payez (TON)",
    "buy__receive_label": "Vous recevez (MAGT)",
    "buy__btn_connect": "Connecter le wallet",
    "buy__btn_processing": "Traitement…",
    "buy__btn_buy": "Acheter MAGT",
    "buy__status_confirming": "Confirmez la transaction dans votre wallet…",
    "buy__status_sent": "Transaction envoyée !",
    "buy__status_failed": "Échec de la transaction.",
    "buy__try_again": "Réessayer",
    "buy__min_error": "Minimum : 1 TON",
    "calc__price": "Prix",
    "calc__price_unit": "prix MAGT",
    "presale_progress__total_presale": "Prévente totale",
    "copy_ref": "Copier le lien de parrainage",
    "copied": "Copié",
    "ref__need_wallet": "Connectez le wallet pour copier le lien de parrainage",
  
  
  },
  "pt": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Resgatar",
    "app__4": "Reivindicar",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "Seu MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "MAGT de referência",
    "app__21": "Abra seu link de referência (ou pressione Copy referral link) e conecte a carteira",
    "app__22": "Conecte a carteira para habilitar a reivindicação",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Comprar",
    "header__4": "FAQ",
    "header__5": "Política de Privacidade",
    "header__6": "Social",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Conectar Carteira",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Comprar",
    "presale_widget__2": "Compra de TON com payload BUY (opcode) + ref. Se ref estiver ausente — ref = sua carteira.",
    "presale_widget__3": "Comprar com TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Quantidade (TON)",
    "presale_widget__6": "Enviando…",
    "presale_widget__7": "Comprar com TON",
    "presale_widget__8": "Conectar carteira",
    "presale_widget__9": "Conectar carteira",
    "presale_widget__10": "Por favor, conecte sua carteira primeiro",
    "presale_widget__11": "Digite uma quantidade de TON maior que 0",
    "presale_widget__12": "Falha ao criar o payload BUY",
    "presale_widget__13": "✅ Transação BUY enviada (atualize o saldo em 3–10 segundos)",
    "presale_widget__14": "Erro de transação",
    "presale_widget__15": "Contrato:",
    "presale_progress__1": "Progresso do presale",
    "presale_progress__2": "Rodada",
    "presale_progress__3": "Vendido nesta rodada",
    "presale_progress__4": "Total vendido",
    "presale_progress__5": "Arrecadado",
    "presale_progress__6": "Preço da próxima rodada",
    "presale_progress__7": "Preço atual",
    "presale_progress__8": "Vendido",
    "presale_progress__9": "TOTAL VENDIDO",
    "projects__1": "Nossos projetos",
    "projects__2": "Projetos lançados e futuros do ecossistema MAGIC TIME",
    "projects__3": "Arrecadado",
    "projects__4": "Roadmap",
    "projects__5": "Todos os projetos",
    "projects__6": "Em breve",
    "projects__7": "Ecossistema",
    "referral__1": "Copiar link de referência",
    "referral__2": "Copiado!",
    "referral__3": "Abra seu link de referência (ou pressione Copy referral link) e conecte a carteira",
    "calculator__1": "Calculadora",
    "calculator__2": "Digite o valor em TON",
    "calculator__3": "Você recebe",
    "calculator__4": "Rodada atual",
    "calculator__5": "Preço",
    "calculator__6": "Compra mínima",
    "calculator__7": "Compra máxima",
    "calculator__8": "Conecte a carteira para calcular",
    "trust__1": "Por que confiar em nós",
    "trust__2": "Smart contract on-chain",
    "trust__3": "Transparência",
    "trust__4": "Rodadas justas",
    "trust__5": "TON rápido e barato",
    "trust__6": "Sem intervenção manual",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Equipe (bloqueada)",
    "tokenomics__2": "Oferta total",
    "tokenomics__3": "Presale",
    "tokenomics__4": "Liquidez",
    "tokenomics__5": "Equipe",
    "tokenomics__6": "Marketing",
    "tokenomics__7": "Outros projetos",
    "roadmap__1": "Roadmap",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Lançamento do presale",
    "roadmap__7": "Listing",
    "roadmap__8": "Staking",
    "roadmap__9": "Expansão do ecossistema",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Contrato inteligente na TON",
    "trust__1_text": "Totalmente on-chain, imutável e verificável.",
    "trust__2_title": "Contrato open-source (GitHub)",
    "trust__2_text": "Código público disponível para revisão.",
    "trust__3_title": "Sem mint após a pré-venda",
    "trust__3_text": "Oferta fixa sem inflação oculta.",
    "trust__4_title": "Bloqueio de liquidez (TBA)",
    "trust__4_text": "Liquidez bloqueada com termos transparentes.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Pré‑venda e crescimento da comunidade",
    "roadmap__q2": "Listagem DEX e lançamento de liquidez",
    "roadmap__q3": "Lançamento do produto e adoção",
    "roadmap__q4": "Expansão do ecossistema",
    "app__claim_gas_note": "O claim envia ~0.35 TON como gas (testnet/mainnet depende da rede).",
    "app__claim": "Resgatar",
    "app__your_magt": "Seu MAGT",
    "app__referral_magt": "MAGT de referência",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Roteiro",
    "tokenomics_title": "Tokenomics",
    "total_supply": "Oferta total",
    "presale": "Pré-venda",
    "liquidity": "Liquidez",
    "team": "Equipe",
    "marketing": "Marketing",
    "other": "Outros projetos",
    "tokenomics__locked_suffix": "(bloqueada)",
    "app__network": "Rede",
    "app__ref_bonus": "Bônus de indicação",
    "app__token": "Token",
    "buy__title": "Comprar MAGT",
    "buy__subtitle": "Pague em TON · Instantâneo on-chain",
    "buy__pay_label": "Você paga (TON)",
    "buy__receive_label": "Você recebe (MAGT)",
    "buy__btn_connect": "Conectar carteira",
    "buy__btn_processing": "Processando…",
    "buy__btn_buy": "Comprar MAGT",
    "buy__status_confirming": "Confirme a transação na sua carteira…",
    "buy__status_sent": "Transação enviada!",
    "buy__status_failed": "Falha na transação.",
    "buy__try_again": "Tentar novamente",
    "buy__min_error": "Mínimo: 1 TON",
    "calc__price": "Preço",
    "calc__price_unit": "preço MAGT",
    "presale_progress__total_presale": "Pré-venda total",
    "copy_ref": "Copiar link de indicação",
    "copied": "Copiado",
    "ref__need_wallet": "Conecte a carteira para copiar o link de indicação",
  
  
  },
  "cn": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "领取",
    "app__4": "领取",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "你的 MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "推荐 MAGT",
    "app__21": "打开你的推荐链接（或点击 Copy referral link）并连接钱包",
    "app__22": "连接钱包以启用领取",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "购买",
    "header__4": "常见问题",
    "header__5": "隐私政策",
    "header__6": "社交",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "连接钱包",
    "header__10": "Connect Wallet",
    "presale_widget__1": "购买",
    "presale_widget__2": "使用 BUY payload（opcode）+ ref 购买 TON。若无 ref — ref = 你的钱包。",
    "presale_widget__3": "使用 TON 购买",
    "presale_widget__4": "Payload：",
    "presale_widget__5": "数量（TON）",
    "presale_widget__6": "发送中…",
    "presale_widget__7": "使用 TON 购买",
    "presale_widget__8": "连接钱包",
    "presale_widget__9": "连接钱包",
    "presale_widget__10": "请先连接你的钱包",
    "presale_widget__11": "请输入大于 0 的 TON 数量",
    "presale_widget__12": "构建 BUY payload 失败",
    "presale_widget__13": "✅ BUY 交易已发送（3–10 秒后刷新余额）",
    "presale_widget__14": "交易错误",
    "presale_widget__15": "合约：",
    "presale_progress__1": "预售进度",
    "presale_progress__2": "轮次",
    "presale_progress__3": "本轮已售",
    "presale_progress__4": "总售出",
    "presale_progress__5": "已筹集",
    "presale_progress__6": "下一轮价格",
    "presale_progress__7": "当前价格",
    "presale_progress__8": "已售",
    "presale_progress__9": "总售出",
    "projects__1": "我们的项目",
    "projects__2": "MAGIC TIME 生态系统已上线和即将推出的项目",
    "projects__3": "已筹集",
    "projects__4": "路线图",
    "projects__5": "所有项目",
    "projects__6": "即将推出",
    "projects__7": "生态系统",
    "referral__1": "复制推荐链接",
    "referral__2": "已复制！",
    "referral__3": "打开你的推荐链接（或点击 Copy referral link）并连接钱包",
    "calculator__1": "计算器",
    "calculator__2": "输入 TON 数量",
    "calculator__3": "你将获得",
    "calculator__4": "当前轮次",
    "calculator__5": "价格",
    "calculator__6": "最小购买",
    "calculator__7": "最大购买",
    "calculator__8": "连接钱包以计算",
    "trust__1": "为什么信任我们",
    "trust__2": "链上智能合约",
    "trust__3": "透明性",
    "trust__4": "公平轮次",
    "trust__5": "快速且低费用的 TON",
    "trust__6": "无人工干预",
    "tokenomics__1": "代币经济",
    "tokenomics__team_locked": "团队（锁定）",
    "tokenomics__2": "总供应量",
    "tokenomics__3": "Presale",
    "tokenomics__4": "流动性",
    "tokenomics__5": "团队",
    "tokenomics__6": "市场营销",
    "tokenomics__7": "其他项目",
    "roadmap__1": "路线图",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "预售启动",
    "roadmap__7": "上市",
    "roadmap__8": "质押",
    "roadmap__9": "生态系统扩展",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "TON 网络智能合约",
    "trust__1_text": "完全链上、不可篡改、可验证。",
    "trust__2_title": "开源合约（GitHub）",
    "trust__2_text": "代码公开，任何人都可审查。",
    "trust__3_title": "预售后不再增发",
    "trust__3_text": "固定供应，无隐藏增发。",
    "trust__4_title": "流动性锁定（TBA）",
    "trust__4_text": "流动性将以透明条件锁定。",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "预售与社区增长",
    "roadmap__q2": "DEX 上线与流动性启动",
    "roadmap__q3": "产品发布与用户采用",
    "roadmap__q4": "生态系统扩展",
    "app__claim_gas_note": "Claim 会发送约 0.35 TON 作为 gas（testnet/mainnet 取决于网络）。",
    "app__claim": "领取",
    "app__your_magt": "你的 MAGT",
    "app__referral_magt": "推荐 MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "发展路线图",
    "tokenomics_title": "代币经济模型",
    "total_supply": "总供应量",
    "presale": "预售",
    "liquidity": "流动性",
    "team": "团队",
    "marketing": "营销",
    "other": "其他项目",
    "tokenomics__locked_suffix": "（锁定）",
    "app__network": "网络",
    "app__ref_bonus": "推荐奖励",
    "app__token": "代币",
    "buy__title": "购买 MAGT",
    "buy__subtitle": "使用 TON 支付 · 链上即时",
    "buy__pay_label": "你支付（TON）",
    "buy__receive_label": "你获得（MAGT）",
    "buy__btn_connect": "连接钱包",
    "buy__btn_processing": "处理中…",
    "buy__btn_buy": "购买 MAGT",
    "buy__status_confirming": "请在钱包中确认交易…",
    "buy__status_sent": "交易已发送！",
    "buy__status_failed": "交易失败。",
    "buy__try_again": "重试",
    "buy__min_error": "最低：1 TON",
    "calc__price": "价格",
    "calc__price_unit": "MAGT 价格",
    "presale_progress__total_presale": "预售总计",
    "copy_ref": "复制邀请链接",
    "copied": "已复制",
    "ref__need_wallet": "连接钱包后才能复制邀请链接",
  
  
  },
  "in": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "क्लेम करें",
    "app__4": "क्लेम करें",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "आपका MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "रेफरल MAGT",
    "app__21": "अपना रेफरल लिंक खोलें (या Copy referral link दबाएँ) और वॉलेट कनेक्ट करें",
    "app__22": "क्लेम सक्षम करने के लिए वॉलेट कनेक्ट करें",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "खरीदें",
    "header__4": "सामान्य प्रश्न",
    "header__5": "गोपनीयता नीति",
    "header__6": "सोशल",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "वॉलेट कनेक्ट करें",
    "header__10": "Connect Wallet",
    "presale_widget__1": "खरीदें",
    "presale_widget__2": "BUY payload (opcode) + ref के साथ TON की खरीद। यदि ref नहीं है — ref = आपका वॉलेट।",
    "presale_widget__3": "TON से खरीदें",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "राशि (TON)",
    "presale_widget__6": "भेजा जा रहा है…",
    "presale_widget__7": "TON से खरीदें",
    "presale_widget__8": "वॉलेट कनेक्ट करें",
    "presale_widget__9": "वॉलेट कनेक्ट करें",
    "presale_widget__10": "कृपया पहले अपना वॉलेट कनेक्ट करें",
    "presale_widget__11": "0 से अधिक TON राशि दर्ज करें",
    "presale_widget__12": "BUY payload बनाने में विफल",
    "presale_widget__13": "✅ BUY ट्रांज़ैक्शन भेजा गया (3–10 सेकंड में बैलेंस रिफ्रेश करें)",
    "presale_widget__14": "ट्रांज़ैक्शन त्रुटि",
    "presale_widget__15": "कॉन्ट्रैक्ट:",
    "presale_progress__1": "प्रिसेल प्रगति",
    "presale_progress__2": "राउंड",
    "presale_progress__3": "इस राउंड में बेचा गया",
    "presale_progress__4": "कुल बेचा गया",
    "presale_progress__5": "जुटाया गया",
    "presale_progress__6": "अगले राउंड की कीमत",
    "presale_progress__7": "वर्तमान कीमत",
    "presale_progress__8": "बेचा गया",
    "presale_progress__9": "कुल बेचा गया",
    "projects__1": "हमारे प्रोजेक्ट्स",
    "projects__2": "MAGIC TIME इकोसिस्टम के लॉन्च किए गए और आगामी प्रोजेक्ट्स",
    "projects__3": "जुटाया गया",
    "projects__4": "रोडमैप",
    "projects__5": "सभी प्रोजेक्ट्स",
    "projects__6": "जल्द आ रहा है",
    "projects__7": "इकोसिस्टम",
    "referral__1": "रेफरल लिंक कॉपी करें",
    "referral__2": "कॉपी हो गया!",
    "referral__3": "अपना रेफरल लिंक खोलें (या Copy referral link दबाएँ) और वॉलेट कनेक्ट करें",
    "calculator__1": "कैलकुलेटर",
    "calculator__2": "TON राशि दर्ज करें",
    "calculator__3": "आपको मिलेगा",
    "calculator__4": "वर्तमान राउंड",
    "calculator__5": "कीमत",
    "calculator__6": "न्यूनतम खरीद",
    "calculator__7": "अधिकतम खरीद",
    "calculator__8": "गणना के लिए वॉलेट कनेक्ट करें",
    "trust__1": "हम पर भरोसा क्यों करें",
    "trust__2": "ऑन-चेन स्मार्ट कॉन्ट्रैक्ट",
    "trust__3": "पारदर्शिता",
    "trust__4": "निष्पक्ष राउंड",
    "trust__5": "तेज़ और सस्ता TON",
    "trust__6": "कोई मैनुअल हस्तक्षेप नहीं",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Team (locked)",
    "tokenomics__2": "कुल आपूर्ति",
    "tokenomics__3": "Presale",
    "tokenomics__4": "लिक्विडिटी",
    "tokenomics__5": "टीम",
    "tokenomics__6": "मार्केटिंग",
    "tokenomics__7": "अन्य प्रोजेक्ट्स",
    "roadmap__1": "रोडमैप",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "प्रिसेल लॉन्च",
    "roadmap__7": "लिस्टिंग",
    "roadmap__8": "स्टेकिंग",
    "roadmap__9": "इकोसिस्टम विस्तार",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "TON पर स्मार्ट कॉन्ट्रैक्ट",
    "trust__1_text": "पूरी तरह ऑन-चेन, अपरिवर्तनीय और सत्यापित।",
    "trust__2_title": "ओपन-सोर्स कॉन्ट्रैक्ट (GitHub)",
    "trust__2_text": "कोड सार्वजनिक रूप से उपलब्ध है।",
    "trust__3_title": "प्रीसेल के बाद कोई मिंट नहीं",
    "trust__3_text": "फिक्स्ड सप्लाई, कोई छिपी हुई मिंटिंग नहीं।",
    "trust__4_title": "लिक्विडिटी लॉक (TBA)",
    "trust__4_text": "लिक्विडिटी पारदर्शी शर्तों पर लॉक की जाएगी।",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "प्रीसेल और कम्युनिटी ग्रोथ",
    "roadmap__q2": "DEX लिस्टिंग और लिक्विडिटी लॉन्च",
    "roadmap__q3": "प्रोडक्ट लॉन्च और अपनाना",
    "roadmap__q4": "इकोसिस्टम विस्तार",
    "app__claim_gas_note": "Claim लगभग 0.35 TON gas के रूप में भेजता है (testnet/mainnet नेटवर्क पर निर्भर).",
    "app__claim": "क्लेम",
    "app__your_magt": "आपका MAGT",
    "app__referral_magt": "रेफरल MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "रोडमैप",
    "tokenomics_title": "टोकनोमिक्स",
    "total_supply": "कुल सप्लाई",
    "presale": "प्रीसेल",
    "liquidity": "लिक्विडिटी",
    "team": "टीम",
    "marketing": "मार्केटिंग",
    "other": "अन्य प्रोजेक्ट्स",
    "tokenomics__locked_suffix": "(locked)",
    "app__network": "नेटवर्क",
    "app__ref_bonus": "रेफरल बोनस",
    "app__token": "टोकन",
    "buy__title": "MAGT खरीदें",
    "buy__subtitle": "TON में भुगतान · तुरंत ऑन-चेन",
    "buy__pay_label": "आप भुगतान करते हैं (TON)",
    "buy__receive_label": "आप प्राप्त करते हैं (MAGT)",
    "buy__btn_connect": "वॉलेट कनेक्ट करें",
    "buy__btn_processing": "प्रोसेस हो रहा है…",
    "buy__btn_buy": "MAGT खरीदें",
    "buy__status_confirming": "अपने वॉलेट में ट्रांज़ैक्शन कन्फ़र्म करें…",
    "buy__status_sent": "ट्रांज़ैक्शन भेज दिया गया!",
    "buy__status_failed": "ट्रांज़ैक्शन विफल।",
    "buy__try_again": "फिर से कोशिश करें",
    "buy__min_error": "न्यूनतम: 1 TON",
    "calc__price": "कीमत",
    "calc__price_unit": "MAGT कीमत",
    "presale_progress__total_presale": "कुल प्रीसेल",
    "copy_ref": "रेफरल लिंक कॉपी करें",
    "copied": "कॉपी हो गया",
    "ref__need_wallet": "रेफरल लिंक कॉपी करने के लिए वॉलेट कनेक्ट करें",
  
  
  },
  "id": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "Klaim",
    "app__4": "Klaim",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "MAGT Anda",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "MAGT Referal",
    "app__21": "Buka tautan referral Anda (atau tekan Copy referral link) dan hubungkan wallet",
    "app__22": "Hubungkan wallet untuk mengaktifkan klaim",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "Beli",
    "header__4": "FAQ",
    "header__5": "Kebijakan Privasi",
    "header__6": "Sosial",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "Hubungkan Wallet",
    "header__10": "Connect Wallet",
    "presale_widget__1": "Beli",
    "presale_widget__2": "Pembelian TON dengan BUY payload (opcode) + ref. Jika ref tidak ada — ref = wallet Anda.",
    "presale_widget__3": "Beli dengan TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "Jumlah (TON)",
    "presale_widget__6": "Mengirim…",
    "presale_widget__7": "Beli dengan TON",
    "presale_widget__8": "Hubungkan wallet",
    "presale_widget__9": "Hubungkan wallet",
    "presale_widget__10": "Silakan hubungkan wallet Anda terlebih dahulu",
    "presale_widget__11": "Masukkan jumlah TON lebih besar dari 0",
    "presale_widget__12": "Gagal membangun BUY payload",
    "presale_widget__13": "✅ Transaksi BUY terkirim (segarkan saldo dalam 3–10 detik)",
    "presale_widget__14": "Kesalahan transaksi",
    "presale_widget__15": "Kontrak:",
    "presale_progress__1": "Progres Presale",
    "presale_progress__2": "Ronde",
    "presale_progress__3": "Terjual di ronde ini",
    "presale_progress__4": "Total terjual",
    "presale_progress__5": "Terkumpul",
    "presale_progress__6": "Harga ronde berikutnya",
    "presale_progress__7": "Harga saat ini",
    "presale_progress__8": "Terjual",
    "presale_progress__9": "TOTAL TERJUAL",
    "projects__1": "Proyek Kami",
    "projects__2": "Proyek yang telah diluncurkan dan akan datang dari ekosistem MAGIC TIME",
    "projects__3": "Terkumpul",
    "projects__4": "Roadmap",
    "projects__5": "Semua proyek",
    "projects__6": "Segera hadir",
    "projects__7": "Ekosistem",
    "referral__1": "Salin tautan referral",
    "referral__2": "Tersalin!",
    "referral__3": "Buka tautan referral Anda (atau tekan Copy referral link) dan hubungkan wallet",
    "calculator__1": "Kalkulator",
    "calculator__2": "Masukkan jumlah TON",
    "calculator__3": "Anda mendapatkan",
    "calculator__4": "Ronde saat ini",
    "calculator__5": "Harga",
    "calculator__6": "Pembelian minimum",
    "calculator__7": "Pembelian maksimum",
    "calculator__8": "Hubungkan wallet untuk menghitung",
    "trust__1": "Mengapa mempercayai kami",
    "trust__2": "Smart contract on-chain",
    "trust__3": "Transparansi",
    "trust__4": "Ronde yang adil",
    "trust__5": "TON cepat & murah",
    "trust__6": "Tanpa intervensi manual",
    "tokenomics__1": "Tokenomics",
    "tokenomics__team_locked": "Tim (terkunci)",
    "tokenomics__2": "Total suplai",
    "tokenomics__3": "Presale",
    "tokenomics__4": "Likuiditas",
    "tokenomics__5": "Tim",
    "tokenomics__6": "Marketing",
    "tokenomics__7": "Proyek lainnya",
    "roadmap__1": "Roadmap",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "Peluncuran presale",
    "roadmap__7": "Listing",
    "roadmap__8": "Staking",
    "roadmap__9": "Ekspansi ekosistem",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "Smart contract di TON",
    "trust__1_text": "Sepenuhnya on-chain, tidak dapat diubah, dan dapat diverifikasi.",
    "trust__2_title": "Kontrak open-source (GitHub)",
    "trust__2_text": "Kode tersedia untuk publik.",
    "trust__3_title": "Tanpa mint setelah presale",
    "trust__3_text": "Pasokan tetap tanpa inflasi tersembunyi.",
    "trust__4_title": "Penguncian likuiditas (TBA)",
    "trust__4_text": "Likuiditas akan dikunci secara transparan.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "Presale dan pertumbuhan komunitas",
    "roadmap__q2": "Listing DEX dan peluncuran likuiditas",
    "roadmap__q3": "Peluncuran produk dan adopsi",
    "roadmap__q4": "Ekspansi ekosistem",
    "app__claim_gas_note": "Claim mengirim ~0.35 TON sebagai gas (testnet/mainnet tergantung jaringan).",
    "app__claim": "Klaim",
    "app__your_magt": "MAGT Anda",
    "app__referral_magt": "MAGT Referal",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "Peta jalan",
    "tokenomics_title": "Tokenomics",
    "total_supply": "Total suplai",
    "presale": "Presale",
    "liquidity": "Likuiditas",
    "team": "Tim",
    "marketing": "Marketing",
    "other": "Proyek lain",
    "tokenomics__locked_suffix": "(terkunci)",
    "app__network": "Jaringan",
    "app__ref_bonus": "Bonus referral",
    "app__token": "Token",
    "buy__title": "Beli MAGT",
    "buy__subtitle": "Bayar dengan TON · Instan on-chain",
    "buy__pay_label": "Anda bayar (TON)",
    "buy__receive_label": "Anda terima (MAGT)",
    "buy__btn_connect": "Hubungkan dompet",
    "buy__btn_processing": "Memproses…",
    "buy__btn_buy": "Beli MAGT",
    "buy__status_confirming": "Konfirmasi transaksi di dompet Anda…",
    "buy__status_sent": "Transaksi terkirim!",
    "buy__status_failed": "Transaksi gagal.",
    "buy__try_again": "Coba lagi",
    "buy__min_error": "Minimum: 1 TON",
    "calc__price": "Harga",
    "calc__price_unit": "harga MAGT",
    "presale_progress__total_presale": "Total presale",
    "copy_ref": "Salin tautan referral",
    "copied": "Tersalin",
    "ref__need_wallet": "Hubungkan dompet untuk menyalin tautan referral",
  
  
  },
  "sa": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "مطالبة",
    "app__4": "مطالبة",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "MAGT الخاص بك",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "MAGT الإحالات",
    "app__21": "افتح رابط الإحالة الخاص بك (أو اضغط Copy referral link) وقم بتوصيل المحفظة",
    "app__22": "قم بتوصيل المحفظة لتفعيل المطالبة",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "شراء",
    "header__4": "الأسئلة",
    "header__5": "سياسة الخصوصية",
    "header__6": "التواصل",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "توصيل المحفظة",
    "header__10": "Connect Wallet",
    "presale_widget__1": "شراء",
    "presale_widget__2": "شراء TON باستخدام BUY payload (opcode) + ref. في حال عدم وجود ref — ref = محفظتك.",
    "presale_widget__3": "الشراء باستخدام TON",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "المبلغ (TON)",
    "presale_widget__6": "جارٍ الإرسال…",
    "presale_widget__7": "الشراء باستخدام TON",
    "presale_widget__8": "توصيل المحفظة",
    "presale_widget__9": "توصيل المحفظة",
    "presale_widget__10": "يرجى توصيل محفظتك أولاً",
    "presale_widget__11": "أدخل مبلغ TON أكبر من 0",
    "presale_widget__12": "فشل في إنشاء BUY payload",
    "presale_widget__13": "✅ تم إرسال معاملة BUY (حدّث رصيدك خلال 3–10 ثوانٍ)",
    "presale_widget__14": "خطأ في المعاملة",
    "presale_widget__15": "العقد:",
    "presale_progress__1": "تقدم البيع المسبق",
    "presale_progress__2": "الجولة",
    "presale_progress__3": "المباع في هذه الجولة",
    "presale_progress__4": "إجمالي المباع",
    "presale_progress__5": "تم جمع",
    "presale_progress__6": "سعر الجولة التالية",
    "presale_progress__7": "السعر الحالي",
    "presale_progress__8": "مباع",
    "presale_progress__9": "إجمالي المباع",
    "projects__1": "مشاريعنا",
    "projects__2": "المشاريع التي تم إطلاقها والقادمة ضمن نظام MAGIC TIME",
    "projects__3": "تم جمع",
    "projects__4": "خريطة الطريق",
    "projects__5": "جميع المشاريع",
    "projects__6": "قريباً",
    "projects__7": "النظام البيئي",
    "referral__1": "نسخ رابط الإحالة",
    "referral__2": "تم النسخ!",
    "referral__3": "افتح رابط الإحالة الخاص بك (أو اضغط Copy referral link) وقم بتوصيل المحفظة",
    "calculator__1": "الآلة الحاسبة",
    "calculator__2": "أدخل مبلغ TON",
    "calculator__3": "ستحصل على",
    "calculator__4": "الجولة الحالية",
    "calculator__5": "السعر",
    "calculator__6": "الحد الأدنى للشراء",
    "calculator__7": "الحد الأقصى للشراء",
    "calculator__8": "قم بتوصيل المحفظة للحساب",
    "trust__1": "لماذا تثق بنا",
    "trust__2": "عقد ذكي على السلسلة",
    "trust__3": "الشفافية",
    "trust__4": "جولات عادلة",
    "trust__5": "TON سريع ومنخفض التكلفة",
    "trust__6": "بدون تدخل يدوي",
    "tokenomics__1": "اقتصاديات التوكن",
    "tokenomics__team_locked": "الفريق (مقفل)",
    "tokenomics__2": "إجمالي المعروض",
    "tokenomics__3": "Presale",
    "tokenomics__4": "السيولة",
    "tokenomics__5": "الفريق",
    "tokenomics__6": "التسويق",
    "tokenomics__7": "مشاريع أخرى",
    "roadmap__1": "خريطة الطريق",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "إطلاق البيع المسبق",
    "roadmap__7": "الإدراج",
    "roadmap__8": "التخزين",
    "roadmap__9": "توسيع النظام البيئي",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "عقد ذكي على TON",
    "trust__1_text": "على السلسلة بالكامل وغير قابل للتعديل.",
    "trust__2_title": "عقد مفتوح المصدر (GitHub)",
    "trust__2_text": "الكود متاح للعامة.",
    "trust__3_title": "لا سك بعد البيع المسبق",
    "trust__3_text": "عرض ثابت بدون تضخم مخفي.",
    "trust__4_title": "قفل السيولة (TBA)",
    "trust__4_text": "سيتم قفل السيولة بشروط شفافة.",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "البيع المسبق ونمو المجتمع",
    "roadmap__q2": "إدراج DEX وإطلاق السيولة",
    "roadmap__q3": "إطلاق المنتج واعتماد المستخدمين",
    "roadmap__q4": "توسيع النظام البيئي",
    "app__claim_gas_note": "المطالبة ترسل حوالي 0.35 TON كـ gas (testnet/mainnet يعتمد على الشبكة).",
    "app__claim": "مطالبة",
    "app__your_magt": "MAGT الخاص بك",
    "app__referral_magt": "MAGT الإحالات",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "خارطة الطريق",
    "tokenomics_title": "اقتصاديات التوكن",
    "total_supply": "إجمالي المعروض",
    "presale": "البيع المسبق",
    "liquidity": "السيولة",
    "team": "الفريق",
    "marketing": "التسويق",
    "other": "مشاريع أخرى",
    "tokenomics__locked_suffix": "(مقفل)",
    "app__network": "الشبكة",
    "app__ref_bonus": "مكافأة الإحالة",
    "app__token": "التوكن",
    "buy__title": "شراء MAGT",
    "buy__subtitle": "ادفع بـ TON · فوري على السلسلة",
    "buy__pay_label": "أنت تدفع (TON)",
    "buy__receive_label": "أنت تستلم (MAGT)",
    "buy__btn_connect": "ربط المحفظة",
    "buy__btn_processing": "جارٍ المعالجة…",
    "buy__btn_buy": "شراء MAGT",
    "buy__status_confirming": "أكد المعاملة في محفظتك…",
    "buy__status_sent": "تم إرسال المعاملة!",
    "buy__status_failed": "فشلت المعاملة.",
    "buy__try_again": "حاول مرة أخرى",
    "buy__min_error": "الحد الأدنى: 1 TON",
    "calc__price": "السعر",
    "calc__price_unit": "سعر MAGT",
    "presale_progress__total_presale": "إجمالي البيع المسبق",
    "copy_ref": "نسخ رابط الإحالة",
    "copied": "تم النسخ",
    "ref__need_wallet": "قم بربط المحفظة لنسخ رابط الإحالة",
  
  
  },
  "bd": {
    "app__1": "MAGIC TIME",
    "app__2": "MAGIC TIME Presale",
    "app__3": "ক্লেইম করুন",
    "app__4": "ক্লেইম করুন",
    "app__5": "Refreshing...",
    "app__6": "Refresh",
    "app__7": "On-chain read error:",
    "app__8": "আপনার MAGT",
    "app__9": "Withdrawable via Claim",
    "app__10": "Nothing to claim yet",
    "app__11": "Connect wallet to enable claim",
    "app__12": "Connect wallet first.",
    "app__13": "Nothing to claim yet.",
    "app__14": "Connect wallet to see",
    "app__15": "Network",
    "app__16": "Pay",
    "app__17": "Token",
    "app__18": "Referral MAGT",
    "app__19": "Open your referral link (or press Copy referral link) and connect wallet",
    "app__20": "রেফারাল MAGT",
    "app__21": "আপনার রেফারাল লিংক খুলুন (অথবা Copy referral link চাপুন) এবং ওয়ালেট সংযোগ করুন",
    "app__22": "ক্লেইম সক্রিয় করতে ওয়ালেট সংযোগ করুন",
    "header__1": "Connect wallet to participate",
    "header__2": "Wallet:",
    "header__3": "কিনুন",
    "header__4": "প্রশ্নাবলী",
    "header__5": "গোপনীয়তা নীতি",
    "header__6": "সোশ্যাল",
    "header__7": "Menu",
    "header__8": "Language",
    "header__9": "ওয়ালেট সংযোগ করুন",
    "header__10": "Connect Wallet",
    "presale_widget__1": "কিনুন",
    "presale_widget__2": "BUY payload (opcode) + ref ব্যবহার করে TON কেনা। যদি ref না থাকে — ref = আপনার ওয়ালেট।",
    "presale_widget__3": "TON দিয়ে কিনুন",
    "presale_widget__4": "Payload:",
    "presale_widget__5": "পরিমাণ (TON)",
    "presale_widget__6": "পাঠানো হচ্ছে…",
    "presale_widget__7": "TON দিয়ে কিনুন",
    "presale_widget__8": "ওয়ালেট সংযোগ করুন",
    "presale_widget__9": "ওয়ালেট সংযোগ করুন",
    "presale_widget__10": "অনুগ্রহ করে আগে আপনার ওয়ালেট সংযোগ করুন",
    "presale_widget__11": "0-এর বেশি TON পরিমাণ লিখুন",
    "presale_widget__12": "BUY payload তৈরি করতে ব্যর্থ হয়েছে",
    "presale_widget__13": "✅ BUY ট্রানজ্যাকশন পাঠানো হয়েছে (৩–১০ সেকেন্ডের মধ্যে ব্যালেন্স রিফ্রেশ করুন)",
    "presale_widget__14": "ট্রানজ্যাকশন ত্রুটি",
    "presale_widget__15": "কন্ট্রাক্ট:",
    "presale_progress__1": "প্রিসেল অগ্রগতি",
    "presale_progress__2": "রাউন্ড",
    "presale_progress__3": "এই রাউন্ডে বিক্রি হয়েছে",
    "presale_progress__4": "মোট বিক্রি হয়েছে",
    "presale_progress__5": "সংগৃহীত",
    "presale_progress__6": "পরবর্তী রাউন্ডের মূল্য",
    "presale_progress__7": "বর্তমান মূল্য",
    "presale_progress__8": "বিক্রি হয়েছে",
    "presale_progress__9": "মোট বিক্রি",
    "projects__1": "আমাদের প্রকল্পসমূহ",
    "projects__2": "MAGIC TIME ইকোসিস্টেমের চালু ও আসন্ন প্রকল্পসমূহ",
    "projects__3": "সংগৃহীত",
    "projects__4": "রোডম্যাপ",
    "projects__5": "সব প্রকল্প",
    "projects__6": "শীঘ্রই আসছে",
    "projects__7": "ইকোসিস্টেম",
    "referral__1": "রেফারাল লিংক কপি করুন",
    "referral__2": "কপি হয়েছে!",
    "referral__3": "আপনার রেফারাল লিংক খুলুন (অথবা Copy referral link চাপুন) এবং ওয়ালেট সংযোগ করুন",
    "calculator__1": "ক্যালকুলেটর",
    "calculator__2": "TON পরিমাণ লিখুন",
    "calculator__3": "আপনি পাবেন",
    "calculator__4": "বর্তমান রাউন্ড",
    "calculator__5": "মূল্য",
    "calculator__6": "সর্বনিম্ন ক্রয়",
    "calculator__7": "সর্বোচ্চ ক্রয়",
    "calculator__8": "গণনার জন্য ওয়ালেট সংযোগ করুন",
    "trust__1": "কেন আমাদের বিশ্বাস করবেন",
    "trust__2": "অন-চেইন স্মার্ট কন্ট্রাক্ট",
    "trust__3": "স্বচ্ছতা",
    "trust__4": "ন্যায্য রাউন্ড",
    "trust__5": "দ্রুত ও সস্তা TON",
    "trust__6": "কোনো ম্যানুয়াল হস্তক্ষেপ নেই",
    "tokenomics__1": "টোকেনোমিক্স",
    "tokenomics__team_locked": "টিম (লকড)",
    "tokenomics__2": "মোট সরবরাহ",
    "tokenomics__3": "Presale",
    "tokenomics__4": "লিকুইডিটি",
    "tokenomics__5": "টিম",
    "tokenomics__6": "মার্কেটিং",
    "tokenomics__7": "অন্যান্য প্রকল্প",
    "roadmap__1": "রোডম্যাপ",
    "roadmap__2": "Q1",
    "roadmap__3": "Q2",
    "roadmap__4": "Q3",
    "roadmap__5": "Q4",
    "roadmap__6": "প্রিসেল লঞ্চ",
    "roadmap__7": "লিস্টিং",
    "roadmap__8": "স্টেকিং",
    "roadmap__9": "ইকোসিস্টেম সম্প্রসারণ",
    "header__0": "Magic Time Presale",
  "app__0": "Buy tokens before listing. Limited supply in each round.",
  "progress__title": "Presale Progress",
  "progress__total": "Total presale",
  "progress__round": "Round",
  "calc__title": "Calculator",
  "calc__subtitle": "USDT → MAGT using current round price",
  "calc__round_price": "Round price",
  "calc__you_pay": "You pay",
  "calc__estimated_value": "Estimated value",
  "calc__you_receive": "You receive",
  "calc__usdt_is_usd": "USDT is treated as USD (1:1)",
  "calc__estimation_note": "* Estimation. Final amount depends on tx + rounding.",

    "projects__title": "Our projects",
    "projects__subtitle": "Launched and upcoming products in the MAGIC TIME ecosystem",
    "projects__raised": "Raised",
    "projects__seg_seed": "Seed",
    "projects__seg_grow": "Grow",
    "projects__seg_scale": "Scale",
    "projects__seg_ecosystem": "Ecosystem",
    "projects__tap_title": "MAGIC TIME TAP",
    "projects__tap_desc": "Live product — click to open.",
    "projects__open": "Open →",
    "projects__live": "Live",
    "projects__coming_soon": "Coming soon",
    "projects__locked": "Locked",
    "projects__p2": "Project #2",
    "projects__p3": "Project #3",
    "projects__p4": "Project #4",
    "trust_title": "Why trust us",
    "trust__1_title": "TON-এ স্মার্ট কন্ট্রাক্ট",
    "trust__1_text": "সম্পূর্ণ অন-চেইন, অপরিবর্তনীয় ও যাচাইযোগ্য।",
    "trust__2_title": "ওপেন-সোর্স কন্ট্রাক্ট (GitHub)",
    "trust__2_text": "কোড সবার জন্য উন্মুক্ত।",
    "trust__3_title": "প্রিসেলের পরে কোনো মিন্ট নয়",
    "trust__3_text": "নির্দিষ্ট সরবরাহ, কোনো গোপন মিন্টিং নেই।",
    "trust__4_title": "লিকুইডিটি লক (TBA)",
    "trust__4_text": "লিকুইডিটি স্বচ্ছ শর্তে লক করা হবে।",
    "roadmap_title": "Roadmap",
    "roadmap__q1": "প্রিসেল ও কমিউনিটি বৃদ্ধি",
    "roadmap__q2": "DEX তালিকাভুক্তি ও লিকুইডিটি চালু",
    "roadmap__q3": "প্রোডাক্ট লঞ্চ ও গ্রহণযোগ্যতা",
    "roadmap__q4": "ইকোসিস্টেম সম্প্রসারণ",
    "app__claim_gas_note": "Claim ~0.35 TON gas হিসেবে পাঠায় (testnet/mainnet নেটওয়ার্কের উপর নির্ভর করে)।",
    "app__claim": "ক্লেইম",
    "app__your_magt": "আপনার MAGT",
    "app__referral_magt": "রেফারাল MAGT",
    "app__onchain_error_prefix": "On-chain read error:",
    "roadmap__title": "রোডম্যাপ",
    "tokenomics_title": "টোকেনোমিক্স",
    "total_supply": "মোট সরবরাহ",
    "presale": "প্রিসেল",
    "liquidity": "লিকুইডিটি",
    "team": "টিম",
    "marketing": "মার্কেটিং",
    "other": "অন্যান্য প্রজেক্ট",
    "tokenomics__locked_suffix": "(লকড)",
    "app__network": "নেটওয়ার্ক",
    "app__ref_bonus": "রেফারেল বোনাস",
    "app__token": "টোকেন",
    "buy__title": "MAGT কিনুন",
    "buy__subtitle": "TON এ পেমেন্ট · তৎক্ষণাৎ অন-চেইন",
    "buy__pay_label": "আপনি পরিশোধ করবেন (TON)",
    "buy__receive_label": "আপনি পাবেন (MAGT)",
    "buy__btn_connect": "ওয়ালেট কানেক্ট করুন",
    "buy__btn_processing": "প্রসেসিং…",
    "buy__btn_buy": "MAGT কিনুন",
    "buy__status_confirming": "আপনার ওয়ালেটে লেনদেনটি নিশ্চিত করুন…",
    "buy__status_sent": "লেনদেন পাঠানো হয়েছে!",
    "buy__status_failed": "লেনদেন ব্যর্থ হয়েছে।",
    "buy__try_again": "আবার চেষ্টা করুন",
    "buy__min_error": "ন্যূনতম: 1 TON",
    "calc__price": "মূল্য",
    "calc__price_unit": "MAGT মূল্য",
    "presale_progress__total_presale": "মোট প্রিসেল",
    "copy_ref": "রেফারেল লিংক কপি করুন",
    "copied": "কপি হয়েছে",
    "ref__need_wallet": "রেফারেল লিংক কপি করতে ওয়ালেট কানেক্ট করুন",
  
  
  },
};

export function t(lang: LangCode, key: string) {
  // ------------------------------------------------------------------
  // ✅ Hardening / aliases
  // - Some components historically used different key names.
  // - Some builds accidentally persisted lang as upper-case ("RU"),
  //   which would break dictionary lookups.
  // ------------------------------------------------------------------

  const normLang = ((lang as unknown as string) || "en").toLowerCase() as LangCode;

  // Key aliases (keeps old components working without touching UI code)
  const ALIAS: Record<string, string> = {
    // Trust/Roadmap titles (old keys)
    trust_title: "trust__1",
    tokenomics_title: "tokenomics__1",
    roadmap_title: "roadmap_title", // already correct
    faq_title: "faq_title", // DICT contains it

    // Calculator (old/new naming)
    calc__title: "calculator__1",
    calc__subtitle: "calculator__4", // "Current round" (closest existing); many UIs show a subtitle line

    // Projects section (newer naming)
    projects__title: "projects__1",
    projects__subtitle: "projects__2",
    projects__raised: "projects__3",

    // Tokenomics label that appeared as a single combined key
    team_tokenomics_locked_suffix: "tokenomics__team_locked",
    trust__title: "trust__1",
    roadmap__title: "roadmap_title",
    tokenomics__locked_suffix: "tokenomics__team_locked",
    app__your_magt: "app__8",
    app__referral_magt: "app__20",
    app__onchain_error_prefix: "app__7",
    app__claim: "app__3",
  };

  const k = ALIAS[key] ?? key;

  return (
    UI_TEXT[normLang]?.[k] ??
    DICT[normLang]?.[k] ??
    UI_TEXT.en?.[k] ??
    DICT.en?.[k] ??
    // if alias didn't exist but original did.
    UI_TEXT[normLang]?.[key] ??
    DICT[normLang]?.[key] ??
    UI_TEXT.en?.[key] ??
    DICT.en?.[key] ??
    key
  );
}
