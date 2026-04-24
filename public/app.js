const state = {
  settings: {},
  categories: [],
  products: [],
  selectedCategory: "all",
  currentLang: localStorage.getItem("mixermate-lang") || "en",
  cart: JSON.parse(localStorage.getItem("mixermate-cart") || "[]")
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const currency = (value) => `$${Number(value || 0).toFixed(0)}`;

const I18N = {
  en: {
    langLabel: "🇺🇸 English",
    announcement: "Purchases are completed securely on Amazon",
    nav_products: "Products",
    nav_categories: "Categories",
    nav_reviews: "Reviews",
    nav_contact: "Contact Us",
    nav_admin: "Admin",
    cart: "Cart",
    hero_title: "Upgrade Your Stand Mixer for Everyday Cooking",
    hero_subtitle:
      "Discover practical, easy-to-use attachments designed for pasta, prep, and more. Compatible with KitchenAid stand mixers.",
    hero_cta1: "Shop on Amazon",
    hero_cta2: "Learn More",
    value_title: "Why Choose Us",
    v1_title: "Premium Quality",
    v1_desc: "Food-grade stainless steel and durable daily-use materials.",
    v2_title: "Perfect Fit",
    v2_desc: "Clear fit guidance for tilt-head and bowl-lift mixers.",
    v3_title: "Easy to Use",
    v3_desc: "Simple installation, quick cleaning, and practical care notes.",
    v4_title: "Expert Support",
    v4_desc: "Support for model matching, replacement parts, and bulk orders.",
    cat_title: "Shop by Category",
    product_title: "Best Sellers",
    all_parts: "All parts",
    add_to_cart: "Buy on Amazon",
    buy_on_amazon: "Buy on Amazon",
    check_price_amazon: "Check Price on Amazon",
    view_availability_amazon: "View Availability on Amazon",
    amazon_not_configured: "Amazon link not configured",
    amazon_checkout_note: "Secure checkout, shipping, and returns are handled by Amazon.",
    amazon_purchase_notice_short: "Purchases are completed on Amazon. Please visit a product and click Buy on Amazon.",
    view_details: "View details",
    product_details: "Product details",
    buy_now: "Buy on Amazon",
    in_stock: "in stock",
    finder_eyebrow: "Fit finder",
    finder_title: "Not sure which attachment fits?",
    finder_text: "Answer two quick questions and we will show Amazon-ready options for your mixer style.",
    finder_style: "Mixer style",
    finder_use: "Main use",
    style_tilt: "Tilt-head",
    style_lift: "Bowl-lift",
    use_baking: "Cookies and cakes",
    use_bread: "Bread and pizza dough",
    use_clean: "Replacement and care",
    finder_btn: "Find Amazon options",
    finder_done: "Matched products are shown. Check price and availability on Amazon.",
    review_title: "Customer Reviews",
    r1_title: "Amazing Quality!",
    r1_text: "Perfect fit for my mixer. Making weekend baking prep is so much easier.",
    r2_title: "Great Value",
    r2_text: "Excellent quality and price. Easy to clean and simple to install.",
    r3_title: "Love It!",
    r3_text: "Works perfectly with my stand mixer. Fast shipping and helpful support.",
    news_title: "Get recipes and deal alerts",
    news_subtitle: "Get free recipes, product tips, and Amazon deal alerts.",
    name_placeholder: "Name",
    news_placeholder: "Enter your email",
    interest_placeholder: "Mixer model or part needed",
    news_btn: "Send Me the Guide",
    lead_ok: "You are on the list.",
    lead_error: "Please enter a valid email.",
    trust_t1: "Amazon Shipping",
    trust_t2: "Amazon Returns",
    trust_t3: "Secure Amazon Checkout",
    trust_t4: "Fit Support",
    cart_title: "Your cart",
    empty_cart: "Your cart is empty.",
    close: "Close",
    total: "Total",
    checkout: "Buy on Amazon",
    checkout_empty: "Add at least one item first.",
    checkout_eyebrow: "Amazon purchase notice",
    checkout_title: "Purchases are completed on Amazon.",
    field_name: "Name",
    field_email: "Email",
    field_phone: "Phone",
    field_address: "Shipping address",
    field_notes: "Notes",
    place_order: "Buy on Amazon",
    order_received: "Order request {id} received.",
    order_error: "Order could not be placed.",
    footer_about: "Practical attachments compatible with KitchenAid stand mixers. Purchases are completed on Amazon.",
    footer_products: "Products",
    footer_company: "Company",
    footer_aboutus: "About Us",
    footer_fit: "Fit Finder",
    footer_support: "Support",
    footer_shipping: "Amazon Purchase Notice",
    footer_returns: "Privacy Policy",
    footer_warranty: "Warranty",
    footer_track: "Disclaimer",
    footer_rights: "All rights reserved.",
    contact_amazon_notice:
      "If you purchased through Amazon, please manage order tracking, shipping, return, or refund requests directly through your Amazon account.",
    faq_title: "FAQ",
    faq_q1: "Do you sell directly on this website?",
    faq_a1: "No. This website provides product information, guides, and recipes. Purchases are completed securely on Amazon.",
    faq_q2: "Where do I complete my purchase?",
    faq_a2: "You can click the Amazon button on each product page to complete your purchase on Amazon.",
    faq_q3: "Who handles shipping and returns?",
    faq_a3: "Since purchases are completed on Amazon, checkout, shipping, returns, and refunds are handled through Amazon.",
    faq_q4: "Are you affiliated with KitchenAid?",
    faq_a4: "No. Our products are compatible with KitchenAid stand mixers, but they are not manufactured by, endorsed by, or affiliated with KitchenAid.",
    faq_q5: "Can I check the latest price on this website?",
    faq_a5: "Prices and availability may change. Please check the Amazon product page for the most accurate information.",
    legal_title: "Amazon Purchase Notice",
    legal_notice:
      "This website provides product information, guides, and recommendations. Purchases are completed on Amazon. Product prices, availability, shipping, returns, and refunds are managed by Amazon and may vary. We do not collect payment information on this website.",
    disclaimer_title: "Disclaimer",
    disclaimer_text:
      "This product is compatible with KitchenAid stand mixers. It is not manufactured by, endorsed by, or affiliated with KitchenAid.",
    privacy_title: "Privacy Policy",
    privacy_text:
      "We collect email signups and site interaction data to improve product guides, recipes, and Amazon deal alerts. We do not collect payment information on this website."
  },
  zh: {
    langLabel: "🇨🇳 中文",
    announcement: "购买将在 Amazon 安全完成",
    nav_products: "产品",
    nav_categories: "分类",
    nav_reviews: "评价",
    nav_contact: "联系我们",
    nav_admin: "后台",
    cart: "购物车",
    hero_title: "升级您的厨师机，轻松完成日常料理",
    hero_subtitle: "探索适合意面、备菜等场景的实用配件。Compatible with KitchenAid stand mixers。",
    hero_cta1: "前往 Amazon 选购",
    hero_cta2: "了解更多",
    value_title: "为什么选择我们",
    v1_title: "优质品质",
    v1_desc: "食品级不锈钢和耐用材质，适合日常高频使用。",
    v2_title: "完美适配",
    v2_desc: "清楚标注抬头式和升降式厨师机的适配范围。",
    v3_title: "易于使用",
    v3_desc: "安装简单、清洗方便，并提供实用保养建议。",
    v4_title: "专业支持",
    v4_desc: "支持型号匹配、替换件咨询和批量采购。",
    cat_title: "按类别选购",
    product_title: "热销产品",
    all_parts: "全部配件",
    add_to_cart: "在 Amazon 购买",
    buy_on_amazon: "在 Amazon 购买",
    check_price_amazon: "在 Amazon 查看价格",
    view_availability_amazon: "在 Amazon 查看库存",
    amazon_not_configured: "Amazon 链接未配置",
    amazon_checkout_note: "安全结账、配送和退换货均由 Amazon 处理。",
    amazon_purchase_notice_short: "购买将在 Amazon 完成。请进入产品并点击在 Amazon 购买。",
    view_details: "查看详情",
    product_details: "商品详情",
    buy_now: "在 Amazon 购买",
    in_stock: "件库存",
    finder_eyebrow: "适配导购",
    finder_title: "不确定哪款配件适合？",
    finder_text: "回答两个问题，我们会展示适合您厨师机类型、可跳转 Amazon 的产品。",
    finder_style: "厨师机类型",
    finder_use: "主要用途",
    style_tilt: "抬头式",
    style_lift: "升降式",
    use_baking: "饼干和蛋糕",
    use_bread: "面包和披萨面团",
    use_clean: "替换和保养",
    finder_btn: "查找 Amazon 产品",
    finder_done: "已显示匹配产品，请在 Amazon 查看价格和库存。",
    review_title: "客户评价",
    r1_title: "品质很棒！",
    r1_text: "和我的厨师机适配很好，周末烘焙准备轻松多了。",
    r2_title: "物超所值",
    r2_text: "质量和价格都不错，容易清洗，安装也简单。",
    r3_title: "非常喜欢！",
    r3_text: "和我的厨师机配合顺手，发货快，客服也很有帮助。",
    news_title: "获取食谱和优惠提醒",
    news_subtitle: "获取免费食谱、产品技巧和 Amazon 优惠提醒。",
    name_placeholder: "姓名",
    news_placeholder: "输入您的邮箱",
    interest_placeholder: "厨师机型号或所需配件",
    news_btn: "发送指南给我",
    lead_ok: "已加入订阅列表。",
    lead_error: "请输入有效邮箱。",
    trust_t1: "Amazon 配送",
    trust_t2: "Amazon 退换",
    trust_t3: "Amazon 安全结账",
    trust_t4: "适配支持",
    cart_title: "您的购物车",
    empty_cart: "购物车为空。",
    close: "关闭",
    total: "合计",
    checkout: "在 Amazon 购买",
    checkout_empty: "请先添加至少一件商品。",
    checkout_eyebrow: "Amazon 购买说明",
    checkout_title: "购买将在 Amazon 完成。",
    field_name: "姓名",
    field_email: "邮箱",
    field_phone: "电话",
    field_address: "收货地址",
    field_notes: "备注",
    place_order: "在 Amazon 购买",
    order_received: "订单请求 {id} 已收到。",
    order_error: "订单提交失败。",
    footer_about: "适用于 KitchenAid 厨师机的实用配件展示站。购买将在 Amazon 完成。",
    footer_products: "产品",
    footer_company: "公司",
    footer_aboutus: "关于我们",
    footer_fit: "适配导购",
    footer_support: "支持",
    footer_shipping: "Amazon 购买说明",
    footer_returns: "隐私政策",
    footer_warranty: "质保",
    footer_track: "免责声明",
    footer_rights: "保留所有权利。",
    contact_amazon_notice: "如果您通过 Amazon 购买，请在 Amazon 账户中处理订单追踪、配送、退货或退款请求。",
    faq_title: "常见问题",
    faq_q1: "这个网站直接销售产品吗？",
    faq_a1: "不直接销售。本网站提供产品信息、指南和食谱，购买将在 Amazon 安全完成。",
    faq_q2: "我在哪里完成购买？",
    faq_a2: "您可以点击每个产品上的 Amazon 按钮，在 Amazon 完成购买。",
    faq_q3: "谁负责配送和退换货？",
    faq_a3: "由于购买在 Amazon 完成，结账、配送、退货和退款均由 Amazon 处理。",
    faq_q4: "你们和 KitchenAid 有官方合作吗？",
    faq_a4: "没有。我们的产品 Compatible with KitchenAid stand mixers，但并非由 KitchenAid 制造、认可或关联。",
    faq_q5: "网站上的价格是最新的吗？",
    faq_a5: "价格和库存可能变化，请以 Amazon 产品页面为准。",
    legal_title: "Amazon 购买说明",
    legal_notice:
      "本网站提供产品信息、指南和推荐。购买将在 Amazon 完成。产品价格、库存、配送、退货和退款由 Amazon 管理且可能变化。我们不会在本网站收集支付信息。",
    disclaimer_title: "免责声明",
    disclaimer_text:
      "This product is compatible with KitchenAid stand mixers. It is not manufactured by, endorsed by, or affiliated with KitchenAid.",
    privacy_title: "隐私政策",
    privacy_text: "我们会收集邮箱订阅和站内互动数据，用于优化产品指南、食谱和 Amazon 优惠提醒。本网站不收集支付信息。"
  },
  fr: {
    langLabel: "🇫🇷 Français",
    announcement: "Achats finalisés en toute sécurité sur Amazon",
    nav_products: "Produits",
    nav_categories: "Catégories",
    nav_reviews: "Avis",
    nav_contact: "Contact",
    nav_admin: "Admin",
    cart: "Panier",
    hero_title: "Améliorez votre robot pâtissier pour la cuisine quotidienne",
    hero_subtitle:
      "Découvrez des accessoires pratiques et faciles à utiliser pour les pâtes, la préparation et plus encore. Compatible with KitchenAid stand mixers.",
    hero_cta1: "Acheter sur Amazon",
    hero_cta2: "En savoir plus",
    value_title: "Pourquoi nous choisir",
    v1_title: "Qualité premium",
    v1_desc: "Acier inoxydable alimentaire et matériaux durables pour un usage quotidien.",
    v2_title: "Compatibilité claire",
    v2_desc: "Guide de compatibilité pour robots à tête inclinable et à bol relevable.",
    v3_title: "Facile à utiliser",
    v3_desc: "Installation simple, nettoyage rapide et conseils d'entretien pratiques.",
    v4_title: "Support expert",
    v4_desc: "Aide pour le choix du modèle, les pièces de remplacement et les commandes groupées.",
    cat_title: "Acheter par catégorie",
    product_title: "Meilleures ventes",
    all_parts: "Toutes les pièces",
    add_to_cart: "Acheter sur Amazon",
    buy_on_amazon: "Acheter sur Amazon",
    check_price_amazon: "Voir le prix sur Amazon",
    view_availability_amazon: "Voir la disponibilité sur Amazon",
    amazon_not_configured: "Lien Amazon non configuré",
    amazon_checkout_note: "Le paiement sécurisé, la livraison et les retours sont gérés par Amazon.",
    amazon_purchase_notice_short: "Les achats sont finalisés sur Amazon. Ouvrez un produit et cliquez sur Acheter sur Amazon.",
    view_details: "Voir détails",
    product_details: "Détails produit",
    buy_now: "Acheter sur Amazon",
    in_stock: "en stock",
    finder_eyebrow: "Guide de compatibilité",
    finder_title: "Vous ne savez pas quel accessoire convient ?",
    finder_text: "Répondez à deux questions et nous afficherons des options prêtes pour Amazon.",
    finder_style: "Type de robot",
    finder_use: "Utilisation principale",
    style_tilt: "Tête inclinable",
    style_lift: "Bol relevable",
    use_baking: "Biscuits et gâteaux",
    use_bread: "Pain et pâte à pizza",
    use_clean: "Remplacement et entretien",
    finder_btn: "Trouver sur Amazon",
    finder_done: "Produits adaptés affichés. Vérifiez le prix et la disponibilité sur Amazon.",
    review_title: "Avis clients",
    r1_title: "Qualité incroyable !",
    r1_text: "Parfait pour mon robot. La préparation du week-end est beaucoup plus simple.",
    r2_title: "Excellent rapport qualité-prix",
    r2_text: "Bonne qualité, bon prix, facile à nettoyer et simple à installer.",
    r3_title: "J'adore !",
    r3_text: "Fonctionne parfaitement avec mon robot. Livraison rapide et support utile.",
    news_title: "Recevez recettes et alertes offres",
    news_subtitle: "Recevez des recettes gratuites, conseils produit et alertes offres Amazon.",
    name_placeholder: "Nom",
    news_placeholder: "Votre e-mail",
    interest_placeholder: "Modèle du robot ou pièce souhaitée",
    news_btn: "M'envoyer le guide",
    lead_ok: "Vous êtes inscrit.",
    lead_error: "Veuillez saisir un e-mail valide.",
    trust_t1: "Livraison Amazon",
    trust_t2: "Retours Amazon",
    trust_t3: "Paiement Amazon sécurisé",
    trust_t4: "Aide compatibilité",
    cart_title: "Votre panier",
    empty_cart: "Votre panier est vide.",
    close: "Fermer",
    total: "Total",
    checkout: "Acheter sur Amazon",
    checkout_empty: "Ajoutez d'abord au moins un article.",
    checkout_eyebrow: "Notice d'achat Amazon",
    checkout_title: "Les achats sont finalisés sur Amazon.",
    field_name: "Nom",
    field_email: "E-mail",
    field_phone: "Téléphone",
    field_address: "Adresse de livraison",
    field_notes: "Notes",
    place_order: "Acheter sur Amazon",
    order_received: "Demande de commande {id} reçue.",
    order_error: "La commande n'a pas pu être envoyée.",
    footer_about: "Accessoires pratiques compatibles avec les robots pâtissiers KitchenAid. Les achats sont finalisés sur Amazon.",
    footer_products: "Produits",
    footer_company: "Entreprise",
    footer_aboutus: "À propos",
    footer_fit: "Guide de compatibilité",
    footer_support: "Support",
    footer_shipping: "Notice d'achat Amazon",
    footer_returns: "Confidentialité",
    footer_warranty: "Garantie",
    footer_track: "Disclaimer",
    footer_rights: "Tous droits réservés.",
    contact_amazon_notice:
      "Si vous avez acheté via Amazon, gérez le suivi, la livraison, les retours ou remboursements depuis votre compte Amazon.",
    faq_title: "FAQ",
    faq_q1: "Vendez-vous directement sur ce site ?",
    faq_a1: "Non. Ce site fournit des informations produit, guides et recettes. Les achats sont finalisés sur Amazon.",
    faq_q2: "Où finaliser mon achat ?",
    faq_a2: "Cliquez sur le bouton Amazon de chaque produit pour finaliser votre achat sur Amazon.",
    faq_q3: "Qui gère la livraison et les retours ?",
    faq_a3: "Comme les achats sont finalisés sur Amazon, paiement, livraison, retours et remboursements sont gérés par Amazon.",
    faq_q4: "Êtes-vous affilié à KitchenAid ?",
    faq_a4: "Non. Nos produits sont compatibles avec les robots KitchenAid, mais ne sont ni fabriqués, ni approuvés, ni affiliés à KitchenAid.",
    faq_q5: "Puis-je voir le dernier prix ici ?",
    faq_a5: "Les prix et disponibilités peuvent changer. Consultez la page Amazon pour l'information la plus exacte.",
    legal_title: "Notice d'achat Amazon",
    legal_notice:
      "Ce site fournit des informations, guides et recommandations. Les achats sont finalisés sur Amazon. Prix, disponibilité, livraison, retours et remboursements sont gérés par Amazon et peuvent varier. Nous ne collectons pas d'informations de paiement sur ce site.",
    disclaimer_title: "Disclaimer",
    disclaimer_text:
      "This product is compatible with KitchenAid stand mixers. It is not manufactured by, endorsed by, or affiliated with KitchenAid.",
    privacy_title: "Politique de confidentialité",
    privacy_text:
      "Nous collectons les inscriptions e-mail et interactions du site pour améliorer les guides, recettes et alertes offres Amazon. Nous ne collectons pas d'informations de paiement."
  },
  es: {
    langLabel: "🇪🇸 Español",
    announcement: "Las compras se completan de forma segura en Amazon",
    nav_products: "Productos",
    nav_categories: "Categorías",
    nav_reviews: "Reseñas",
    nav_contact: "Contacto",
    nav_admin: "Admin",
    cart: "Carrito",
    hero_title: "Mejora tu batidora de pedestal para cocinar a diario",
    hero_subtitle:
      "Descubre accesorios prácticos y fáciles de usar para pasta, preparación y más. Compatible with KitchenAid stand mixers.",
    hero_cta1: "Comprar en Amazon",
    hero_cta2: "Saber más",
    value_title: "Por qué elegirnos",
    v1_title: "Calidad premium",
    v1_desc: "Acero inoxidable alimentario y materiales duraderos para uso diario.",
    v2_title: "Ajuste claro",
    v2_desc: "Guía de compatibilidad para batidoras de cabezal inclinable y de bol elevable.",
    v3_title: "Fácil de usar",
    v3_desc: "Instalación simple, limpieza rápida y consejos prácticos de cuidado.",
    v4_title: "Soporte experto",
    v4_desc: "Ayuda con modelos, piezas de reemplazo y pedidos al por mayor.",
    cat_title: "Comprar por categoría",
    product_title: "Más vendidos",
    all_parts: "Todas las piezas",
    add_to_cart: "Comprar en Amazon",
    buy_on_amazon: "Comprar en Amazon",
    check_price_amazon: "Ver precio en Amazon",
    view_availability_amazon: "Ver disponibilidad en Amazon",
    amazon_not_configured: "Enlace de Amazon no configurado",
    amazon_checkout_note: "El pago seguro, envío y devoluciones son gestionados por Amazon.",
    amazon_purchase_notice_short: "Las compras se completan en Amazon. Abre un producto y haz clic en Comprar en Amazon.",
    view_details: "Ver detalles",
    product_details: "Detalles del producto",
    buy_now: "Comprar en Amazon",
    in_stock: "en stock",
    finder_eyebrow: "Buscador de ajuste",
    finder_title: "¿No sabes qué accesorio encaja?",
    finder_text: "Responde dos preguntas y mostraremos opciones listas para Amazon.",
    finder_style: "Tipo de batidora",
    finder_use: "Uso principal",
    style_tilt: "Cabezal inclinable",
    style_lift: "Bol elevable",
    use_baking: "Galletas y pasteles",
    use_bread: "Pan y masa de pizza",
    use_clean: "Reemplazo y cuidado",
    finder_btn: "Buscar en Amazon",
    finder_done: "Productos compatibles mostrados. Revisa precio y disponibilidad en Amazon.",
    review_title: "Reseñas de clientes",
    r1_title: "¡Calidad increíble!",
    r1_text: "Encaja perfecto con mi batidora. Preparar repostería es mucho más fácil.",
    r2_title: "Gran valor",
    r2_text: "Excelente calidad y precio. Fácil de limpiar y simple de instalar.",
    r3_title: "¡Me encanta!",
    r3_text: "Funciona perfecto con mi batidora. Envío rápido y soporte útil.",
    news_title: "Recibe recetas y alertas de ofertas",
    news_subtitle: "Recibe recetas gratis, consejos de producto y alertas de ofertas de Amazon.",
    name_placeholder: "Nombre",
    news_placeholder: "Tu correo electrónico",
    interest_placeholder: "Modelo de batidora o pieza necesaria",
    news_btn: "Envíame la guía",
    lead_ok: "Ya estás en la lista.",
    lead_error: "Introduce un correo electrónico válido.",
    trust_t1: "Envío de Amazon",
    trust_t2: "Devoluciones Amazon",
    trust_t3: "Pago seguro en Amazon",
    trust_t4: "Soporte de ajuste",
    cart_title: "Tu carrito",
    empty_cart: "Tu carrito está vacío.",
    close: "Cerrar",
    total: "Total",
    checkout: "Comprar en Amazon",
    checkout_empty: "Añade al menos un producto primero.",
    checkout_eyebrow: "Aviso de compra Amazon",
    checkout_title: "Las compras se completan en Amazon.",
    field_name: "Nombre",
    field_email: "Correo electrónico",
    field_phone: "Teléfono",
    field_address: "Dirección de envío",
    field_notes: "Notas",
    place_order: "Comprar en Amazon",
    order_received: "Solicitud de pedido {id} recibida.",
    order_error: "No se pudo enviar el pedido.",
    footer_about: "Accesorios prácticos compatibles con batidoras KitchenAid. Las compras se completan en Amazon.",
    footer_products: "Productos",
    footer_company: "Empresa",
    footer_aboutus: "Sobre nosotros",
    footer_fit: "Buscador de ajuste",
    footer_support: "Soporte",
    footer_shipping: "Aviso de compra Amazon",
    footer_returns: "Privacidad",
    footer_warranty: "Garantía",
    footer_track: "Aviso legal",
    footer_rights: "Todos los derechos reservados.",
    contact_amazon_notice:
      "Si compraste en Amazon, gestiona seguimiento, envío, devolución o reembolso directamente desde tu cuenta de Amazon.",
    faq_title: "FAQ",
    faq_q1: "¿Venden directamente en este sitio?",
    faq_a1: "No. Este sitio ofrece información, guías y recetas. Las compras se completan de forma segura en Amazon.",
    faq_q2: "¿Dónde completo mi compra?",
    faq_a2: "Haz clic en el botón de Amazon de cada producto para completar la compra en Amazon.",
    faq_q3: "¿Quién gestiona envío y devoluciones?",
    faq_a3: "Como las compras se completan en Amazon, pago, envío, devoluciones y reembolsos son gestionados por Amazon.",
    faq_q4: "¿Están afiliados a KitchenAid?",
    faq_a4: "No. Nuestros productos son compatibles con batidoras KitchenAid, pero no son fabricados, avalados ni afiliados a KitchenAid.",
    faq_q5: "¿Puedo ver el precio más reciente aquí?",
    faq_a5: "Los precios y disponibilidad pueden cambiar. Consulta la página de Amazon para la información más exacta.",
    legal_title: "Aviso de compra Amazon",
    legal_notice:
      "Este sitio proporciona información, guías y recomendaciones. Las compras se completan en Amazon. Precios, disponibilidad, envío, devoluciones y reembolsos son gestionados por Amazon y pueden variar. No recopilamos información de pago en este sitio.",
    disclaimer_title: "Aviso legal",
    disclaimer_text:
      "This product is compatible with KitchenAid stand mixers. It is not manufactured by, endorsed by, or affiliated with KitchenAid.",
    privacy_title: "Política de privacidad",
    privacy_text:
      "Recopilamos suscripciones de email e interacciones para mejorar guías, recetas y alertas de ofertas Amazon. No recopilamos información de pago."
  }
};

const CATEGORY_I18N = {
  en: {
    pasta: ["Pasta Attachments", "Rollers, cutters, and pasta shaping kits"],
    grinders: ["Meat Grinders", "Grinding plates, food grinder tools, and sausage parts"],
    slicers: ["Slicers & Shredders", "Vegetable prep, cheese shredding, and spiralizing"],
    baking: ["Baking Tools", "Beaters, dough hooks, and frozen dessert tools"],
    bowls: ["Bowls", "Replacement bowls and handles"],
    beaters: ["Beaters", "Flex edge and flat beater tools"],
    hooks: ["Dough Hooks", "Bread, pizza, and bagel kneading"],
    guards: ["Pouring Shields", "Cleaner pours and less flour dust"],
    care: ["Care Kits", "Cleaning, tune-up, and maintenance"]
  },
  zh: {
    pasta: ["意面配件", "压面、切面和意面成型套装"],
    grinders: ["绞肉配件", "绞肉盘、食物研磨和香肠配件"],
    slicers: ["切片切丝", "蔬菜处理、奶酪切丝和螺旋切片"],
    baking: ["烘焙工具", "搅拌桨、和面钩和冰品工具"],
    bowls: ["搅拌碗", "替换碗和手柄配件"],
    beaters: ["搅拌桨", "刮边桨和平面搅拌工具"],
    hooks: ["和面钩", "面包、披萨和贝果揉面"],
    guards: ["防溅盖", "倒料更干净，减少面粉飞散"],
    care: ["保养套装", "清洁、调试和日常维护"]
  },
  fr: {
    pasta: ["Accessoires pâtes", "Laminoirs, découpeurs et kits de façonnage"],
    grinders: ["Hachoirs", "Plaques de hachage, outils alimentaires et saucisses"],
    slicers: ["Trancheurs & râpes", "Préparation légumes, fromage râpé et spirales"],
    baking: ["Outils pâtisserie", "Batteurs, crochets et desserts glacés"],
    bowls: ["Bols", "Bols de remplacement et poignées"],
    beaters: ["Batteurs", "Batteurs plats et à bord flexible"],
    hooks: ["Crochets pétrisseurs", "Pain, pizza et pâtes fermes"],
    guards: ["Couvercles verseurs", "Versement propre et moins de farine"],
    care: ["Kits d'entretien", "Nettoyage, réglage et maintenance"]
  },
  es: {
    pasta: ["Accesorios de pasta", "Rodillos, cortadores y kits para dar forma"],
    grinders: ["Molinos de carne", "Placas, herramientas de molienda y salchichas"],
    slicers: ["Cortadores y ralladores", "Verduras, queso rallado y espirales"],
    baking: ["Herramientas de repostería", "Batidores, ganchos y postres helados"],
    bowls: ["Boles", "Boles de reemplazo y asas"],
    beaters: ["Batidores", "Batidores planos y de borde flexible"],
    hooks: ["Ganchos de masa", "Pan, pizza y masas firmes"],
    guards: ["Protectores de vertido", "Vertido limpio y menos harina"],
    care: ["Kits de cuidado", "Limpieza, ajuste y mantenimiento"]
  }
};

const PRODUCT_I18N = {
  zh: {
    "steel-bowl-5qt": ["5 夸脱不锈钢碗", "带手柄拉丝不锈钢替换碗，倒料顺手，清洁方便。"],
    "flex-edge-beater": ["刮边搅拌桨", "制作糖霜、饼干面团和蛋糕糊时可同步刮边。"],
    "spiral-dough-hook": ["涂层螺旋和面钩", "适合揉披萨、布里欧修、吐司和贝果面团。"],
    "clear-pouring-shield": ["透明防溅倒料盖", "卡扣式防溅盖，让面粉留在碗里，倒料更干净。"],
    "attachment-care-kit": ["配件保养套装", "含食品安全抛光布、刷具、接口垫圈和维护清单。"],
    "baker-bundle": ["烘焙焕新套装", "刮边桨、防溅盖和保养套装组合，快速升级烘焙体验。"]
  },
  fr: {
    "steel-bowl-5qt": ["Bol inox 5 qt", "Bol de remplacement en inox brossé avec poignée et bec verseur."],
    "flex-edge-beater": ["Batteur à bord flexible", "Racle le bol pendant les glaçages, pâtes à biscuits et pâtes à gâteau."],
    "spiral-dough-hook": ["Crochet pétrisseur spiralé", "Pour pétrir pizza, brioche, pain de mie et bagels."],
    "clear-pouring-shield": ["Couvercle verseur transparent", "Se clipse sur le bol pour limiter la farine et faciliter le versement."],
    "attachment-care-kit": ["Kit d'entretien accessoires", "Chiffon alimentaire, brosses, joint de moyeu et liste d'entretien."],
    "baker-bundle": ["Pack de remise à neuf pâtisserie", "Batteur flexible, couvercle verseur et kit d'entretien en pack."]
  },
  es: {
    "steel-bowl-5qt": ["Bol de acero inoxidable 5 qt", "Bol de reemplazo de acero cepillado con asa y borde de vertido."],
    "flex-edge-beater": ["Batidor de borde flexible", "Raspa el bol al mezclar glaseado, masa de galletas y pasteles."],
    "spiral-dough-hook": ["Gancho espiral recubierto", "Para amasar pizza, brioche, pan de molde y bagels."],
    "clear-pouring-shield": ["Protector de vertido transparente", "Se engancha al bol para mantener la harina dentro y verter mejor."],
    "attachment-care-kit": ["Kit de cuidado de accesorios", "Paño alimentario, cepillos, junta del eje y lista de mantenimiento."],
    "baker-bundle": ["Pack de renovación repostera", "Batidor flexible, protector de vertido y kit de cuidado en un pack."]
  }
};

const BADGE_I18N = {
  zh: {
    "Best seller": "热销",
    "Low effort": "省力",
    "Bread day": "面包日",
    "Less mess": "少飞粉",
    "Tune-up": "保养",
    "Bundle": "套装"
  },
  fr: {
    "Best seller": "Meilleure vente",
    "Low effort": "Facile",
    "Bread day": "Jour du pain",
    "Less mess": "Plus propre",
    "Tune-up": "Entretien",
    "Bundle": "Pack"
  },
  es: {
    "Best seller": "Más vendido",
    "Low effort": "Fácil",
    "Bread day": "Día de pan",
    "Less mess": "Menos desorden",
    "Tune-up": "Cuidado",
    "Bundle": "Pack"
  }
};

const MODEL_I18N = {
  zh: {
    "Tilt-head 4.5-5 qt": "抬头式 4.5-5 夸脱",
    "Bowl-lift 5-6 qt": "升降式 5-6 夸脱",
    "All stand mixers": "所有厨师机"
  },
  fr: {
    "Tilt-head 4.5-5 qt": "Tête inclinable 4,5-5 qt",
    "Bowl-lift 5-6 qt": "Bol relevable 5-6 qt",
    "All stand mixers": "Tous robots pâtissiers"
  },
  es: {
    "Tilt-head 4.5-5 qt": "Cabezal inclinable 4.5-5 qt",
    "Bowl-lift 5-6 qt": "Bol elevable 5-6 qt",
    "All stand mixers": "Todas las batidoras"
  }
};

const categoryImages = {
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80",
  grinders: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=700&q=80",
  slicers: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
  baking: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
  bowls: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80",
  beaters: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=700&q=80",
  hooks: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
  guards: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80",
  care: "https://images.unsplash.com/photo-1583947581924-a6d1dc386a6f?auto=format&fit=crop&w=700&q=80"
};

function t(key) {
  return I18N[state.currentLang]?.[key] || I18N.en[key] || key;
}

function translatedCategory(category) {
  const translated = CATEGORY_I18N[state.currentLang]?.[category.id];
  return translated ? translated[0] : category.name;
}

function translatedCategoryDesc(category) {
  return CATEGORY_I18N[state.currentLang]?.[category.id]?.[1] || category.name;
}

function translatedProduct(product) {
  const translated = PRODUCT_I18N[state.currentLang]?.[product.id];
  return {
    name: translated?.[0] || product.name,
    description: translated?.[1] || product.description,
    badge: BADGE_I18N[state.currentLang]?.[product.badge] || product.badge,
    modelFit: MODEL_I18N[state.currentLang]?.[product.modelFit] || product.modelFit
  };
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.setTimeout(() => node.classList.remove("show"), 2600);
}

function saveCart() {
  localStorage.setItem("mixermate-cart", JSON.stringify(state.cart));
  renderCart();
}

function track(type, payload = {}) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload, path: window.location.pathname, lang: state.currentLang })
  }).catch(() => {});
}

function queryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function amazonTarget(product) {
  if (product.amazonButtonEnabled === false) return "";
  return product.amazonAttributionUrl || product.amazonUrl || "";
}

function amazonButtonText(product, fallbackKey = "buy_on_amazon") {
  return product.amazonButtonText || t(fallbackKey);
}

function amazonButton(product, location, fallbackKey = "buy_on_amazon") {
  const target = amazonTarget(product);
  const disabled = target ? "" : "disabled";
  const title = target ? t("amazon_checkout_note") : t("amazon_not_configured");
  return `<button class="btn btn-primary" type="button" data-amazon="${product.id}" data-location="${location}" ${disabled} title="${title}">${target ? amazonButtonText(product, fallbackKey) : t("amazon_not_configured")}</button>`;
}

function fireMarketingPixels(payload) {
  window.dataLayer?.push?.({ event: "amazon_click", ...payload });
  window.gtag?.("event", "amazon_click", payload);
  window.fbq?.("trackCustom", "amazon_click", payload);
  window.ttq?.track?.("amazon_click", payload);
}

function initMarketingPixels() {
  const { ga4Id, gtmId } = state.settings || {};
  if (gtmId && !window.dataLayer) window.dataLayer = [];
  if (ga4Id && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.appendChild(script);
  }
}

function recordAmazonClick(product, buttonLocation, amazonUrl) {
  const payload = {
    productName: product.productName || product.name,
    productSlug: product.productSlug || product.id,
    buttonLocation,
    pagePath: window.location.pathname,
    amazonUrl,
    clickedAt: new Date().toISOString(),
    referrer: document.referrer || "",
    utmSource: queryParam("utm_source"),
    utmMedium: queryParam("utm_medium"),
    utmCampaign: queryParam("utm_campaign"),
    userAgent: navigator.userAgent,
    timestamp: Date.now()
  };
  fireMarketingPixels(payload);
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/amazon-click", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/amazon-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  }
}

function openAmazonProduct(id, buttonLocation) {
  const product = productById(id);
  if (!product) return;
  const target = amazonTarget(product);
  if (!target) {
    toast(t("amazon_not_configured"));
    return;
  }
  recordAmazonClick(product, buttonLocation, target);
  window.open(target, "_blank", "noopener,noreferrer");
}

function productById(id) {
  return state.products.find((product) => product.id === id);
}

function cartTotal() {
  return state.cart.reduce((sum, line) => {
    const product = productById(line.id);
    return product ? sum + product.price * line.qty : sum;
  }, 0);
}

function productImages(product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (product.image && !images.includes(product.image)) images.unshift(product.image);
  return images.filter(Boolean).slice(0, 5);
}

function setMeta(name, content, attr = "name") {
  let node = document.querySelector(`meta[${attr}="${name}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function resetSeo() {
  const title = "Premium Stand Mixer Attachments | Compatible with KitchenAid Stand Mixers";
  const description =
    "Discover practical attachments for stand mixers, including pasta and kitchen prep accessories. Compatible with KitchenAid stand mixers. Shop securely on Amazon.";
  document.title = title;
  setMeta("description", description);
  setMeta("og:title", title, "property");
  setMeta("og:description", description, "property");
}

function setProductSeo(product) {
  const title = `${product.productName || product.name} | Compatible with KitchenAid Stand Mixers`;
  const description = `Learn more about ${product.productName || product.name}, designed for everyday home cooking and compatible with KitchenAid stand mixers. Check price and availability on Amazon.`;
  document.title = title;
  setMeta("description", description);
  setMeta("og:title", title, "property");
  setMeta("og:description", description, "property");
  if (primaryImage(product)) setMeta("og:image", primaryImage(product), "property");
}

function primaryImage(product) {
  return productImages(product)[0] || product.image || "";
}

function applyLanguage() {
  const lang = state.currentLang;
  document.documentElement.lang = lang;
  localStorage.setItem("mixermate-lang", lang);
  $("#currentLangLabel").textContent = t("langLabel");

  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (I18N[lang]?.[key] || I18N.en[key]) node.textContent = t(key);
  });
  $$("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (I18N[lang]?.[key] || I18N.en[key]) node.placeholder = t(key);
  });
  $$(".lang-option").forEach((option) => {
    option.classList.toggle("active", option.dataset.lang === lang);
  });

  renderSettings();
  renderCategoryCards();
  renderCategories();
  renderProducts();
  renderCart();
  renderFooterLinks();
}

function renderSettings() {
  $("#announcement").textContent =
    state.currentLang === "en" ? state.settings.announcement || t("announcement") : t("announcement");
  $("#brandName").textContent = state.settings.brandName || "MixerAttach";
  $("#heroTitle").textContent =
    state.currentLang === "en" ? state.settings.heroTitle || t("hero_title") : t("hero_title");
  $("#heroSubtitle").textContent =
    state.currentLang === "en" ? state.settings.heroSubtitle || t("hero_subtitle") : t("hero_subtitle");
  $("#supportEmail").textContent = state.settings.supportEmail || "support@mixerattach.com";
}

function renderFooterLinks() {
  $$("[data-category-link]").forEach((link) => {
    const category = state.categories.find((entry) => entry.id === link.dataset.categoryLink);
    if (category) link.textContent = translatedCategory(category);
  });
}

function renderCategoryCards() {
  $("#categoryCards").innerHTML = state.categories
    .map(
      (category) => `
        <article class="category-card" data-category-card="${category.id}">
          <img src="${categoryImages[category.id] || categoryImages.care}" alt="${translatedCategory(category)}" loading="lazy" />
          <div class="category-overlay"></div>
          <div class="category-info">
            <h3>${translatedCategory(category)}</h3>
            <p>${translatedCategoryDesc(category)}</p>
          </div>
        </article>
      `
    )
    .join("");

  $$("[data-category-card]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedCategory = card.dataset.categoryCard;
      renderCategories();
      renderProducts();
      $("#products").scrollIntoView({ behavior: "smooth" });
      track("category_card_selected", { category: state.selectedCategory });
    });
  });
}

function renderCategories() {
  const tabs = $("#categoryTabs");
  const options = [{ id: "all", name: t("all_parts") }, ...state.categories];
  tabs.innerHTML = options
    .map((category) => {
      const label = category.id === "all" ? t("all_parts") : translatedCategory(category);
      return `<button class="${category.id === state.selectedCategory ? "active" : ""}" type="button" data-category="${category.id}">${label}</button>`;
    })
    .join("");

  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.dataset.category;
      renderCategories();
      renderProducts();
      track("category_selected", { category: state.selectedCategory });
    });
  });
}

function renderProducts() {
  const products = state.products.filter((product) => {
    return state.selectedCategory === "all" || product.category === state.selectedCategory;
  });

  $("#productGrid").innerHTML = products
    .map((product) => {
      const display = translatedProduct(product);
      const cover = primaryImage(product);
      return `
        <article class="product-card">
          <div class="product-img" style="--product-color:${product.color}">
            <img src="${cover}" alt="${display.name}" loading="lazy" />
            <span class="badge">${display.badge}</span>
          </div>
          <div class="product-info">
            <h3>${display.name}</h3>
            <div class="rating">
              <span class="stars">★★★★★</span>
              <span>4.8 (${Math.max(89, product.inventory * 5)})</span>
            </div>
            <p>${display.description}</p>
            <small>${display.modelFit} · ${product.inventory} ${t("in_stock")}</small>
            <div class="price-row">
              <span class="product-price">${currency(product.price)}</span>
              <s>${currency(product.compareAt)}</s>
            </div>
            <div class="product-card-actions">
              <button class="btn btn-secondary detail-button" type="button" data-detail="${product.id}">${t("view_details")}</button>
              ${amazonButton(product, "product_card", "check_price_amazon")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  $("#productGrid").querySelectorAll("[data-amazon]").forEach((button) => {
    button.addEventListener("click", () => openAmazonProduct(button.dataset.amazon, button.dataset.location));
  });
  $("#productGrid").querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => openProductDetail(button.dataset.detail));
  });
}

function openProductDetail(id) {
  const product = productById(id);
  if (!product) return;
  const display = translatedProduct(product);
  const images = productImages(product);
  $("#productDetail").innerHTML = `
    <div class="product-detail-header">
      <p class="eyebrow">${t("product_details")}</p>
      <button class="ghost-button" type="button" id="closeProductDetail">${t("close")}</button>
    </div>
    <div class="product-detail-grid">
      <div class="product-gallery">
        <img class="product-gallery-main" id="productGalleryMain" src="${images[0] || ""}" alt="${display.name}" />
        <div class="product-gallery-thumbs">
          ${images
            .map(
              (image, index) =>
                `<button class="${index === 0 ? "active" : ""}" type="button" data-gallery-image="${image}"><img src="${image}" alt="${display.name} ${index + 1}" /></button>`
            )
            .join("")}
        </div>
      </div>
      <div class="product-detail-copy">
        <span class="badge inline">${display.badge}</span>
        <h2>${display.name}</h2>
        <div class="rating"><span class="stars">★★★★★</span><span>4.8 (${Math.max(89, product.inventory * 5)})</span></div>
        <p>${display.description}</p>
        <small>${display.modelFit} · ${product.inventory} ${t("in_stock")}</small>
        <div class="price-row">
          <span class="product-price">${currency(product.price)}</span>
          <s>${currency(product.compareAt)}</s>
        </div>
        ${amazonButton(product, "product_detail", "buy_on_amazon")}
        <small>${t("amazon_checkout_note")}</small>
      </div>
    </div>
  `;
  $("#productDialog").showModal();
  setProductSeo(product);
  $("#closeProductDetail").addEventListener("click", () => $("#productDialog").close());
  $("#productDialog").addEventListener("close", resetSeo, { once: true });
  $("#productDetail").querySelector("[data-amazon]").addEventListener("click", (event) => {
    openAmazonProduct(event.currentTarget.dataset.amazon, event.currentTarget.dataset.location);
  });
  $("#productDetail").querySelectorAll("[data-gallery-image]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#productGalleryMain").src = button.dataset.galleryImage;
      $("#productDetail").querySelectorAll("[data-gallery-image]").forEach((entry) => entry.classList.remove("active"));
      button.classList.add("active");
    });
  });
  track("product_detail_viewed", { id });
}

function addToCart(id, qty = 1) {
  const existing = state.cart.find((line) => line.id === id);
  if (existing) existing.qty += qty;
  else state.cart.push({ id, qty });
  saveCart();
  openCart();
  track("add_to_cart", { id, qty });
}

function updateQty(id, delta) {
  const line = state.cart.find((entry) => entry.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
  saveCart();
}

function renderCart() {
  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = currency(cartTotal());

  if (!state.cart.length) {
    $("#cartItems").innerHTML = `<p>${t("empty_cart")}</p>`;
    return;
  }

  $("#cartItems").innerHTML = state.cart
    .map((line) => {
      const product = productById(line.id);
      if (!product) return "";
      const display = translatedProduct(product);
      return `
        <div class="cart-line">
          <strong>${display.name}</strong>
          <span>${currency(product.price)} · ${display.modelFit}</span>
          <div class="cart-line-controls">
            <button type="button" data-qty="${product.id}" data-delta="-1">-</button>
            <span>${line.qty}</span>
            <button type="button" data-qty="${product.id}" data-delta="1">+</button>
          </div>
        </div>
      `;
    })
    .join("");

  $("#cartItems").querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => updateQty(button.dataset.qty, Number(button.dataset.delta)));
  });
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
}

function bindEvents() {
  $("#cartButton").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);

  $("#langButton").addEventListener("click", (event) => {
    event.stopPropagation();
    $("#langSwitcher").classList.toggle("open");
  });
  $$(".lang-option").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      state.currentLang = option.dataset.lang;
      $("#langSwitcher").classList.remove("open");
      applyLanguage();
      track("language_changed", { lang: state.currentLang });
    });
  });
  document.addEventListener("click", () => $("#langSwitcher").classList.remove("open"));

  $("#finderForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const style = form.get("style");
    const use = form.get("use");
    const picks = state.products.filter((product) => {
      if (use === "bread") return product.category === "hooks" || product.modelFit === style;
      if (use === "clean") return product.category === "care" || product.modelFit === "All stand mixers";
      return product.modelFit === style && ["baking", "bowls"].includes(product.category);
    });
    if (picks[0]?.category) state.selectedCategory = picks[0].category;
    renderCategories();
    renderProducts();
    $("#products").scrollIntoView({ behavior: "smooth" });
    track("finder_completed", { style, use });
    toast(t("finder_done"));
  });

  $("#leadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, lang: state.currentLang })
    });
    if (response.ok) {
      event.currentTarget.reset();
      toast(t("lead_ok"));
    } else {
      toast(t("lead_error"));
    }
  });

  $("#checkoutButton").addEventListener("click", () => {
    closeCart();
    track("amazon_checkout_notice_viewed", { total: cartTotal() });
    toast(t("amazon_purchase_notice_short"));
  });

  $("#closeCheckout").addEventListener("click", () => {
    $("#checkoutDialog").close();
  });

  $("#checkoutForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const customer = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: { ...customer, lang: state.currentLang }, items: state.cart })
    });
    const data = await response.json();
    if (response.ok) {
      state.cart = [];
      saveCart();
      $("#checkoutDialog").close();
      event.currentTarget.reset();
      toast(t("order_received").replace("{id}", data.order.id));
    } else {
      toast(data.error || t("order_error"));
    }
  });
}

async function init() {
  const response = await fetch("/api/catalog");
  const data = await response.json();
  state.settings = data.settings;
  state.categories = data.categories;
  state.products = data.products;
  resetSeo();
  initMarketingPixels();
  bindEvents();
  applyLanguage();
  track("page_view", { title: document.title });
}

init().catch(() => {
  toast("Store data could not load.");
});
