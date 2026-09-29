# Ewo

Boutique de vêtements connectée à [Printify](https://printify.com) :

- **Collections** : les produits publiés dans la boutique Printify s'affichent automatiquement, regroupés par leur premier tag.
- **Personnalisation** : le client choisit un t-shirt ou un sweat, sa couleur et sa taille, et ajoute son image.
- **Paiement** avec Stripe Checkout. Une fois le paiement reçu, le webhook crée la commande chez Printify, livrée à l'**adresse prédéfinie** (`SHIP_TO_*`).

Stack : Next.js 16 (App Router), React 19, Tailwind CSS 4, Stripe.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # facultatif : sans clés, le site tourne en mode démo
npm run dev
```

Puis ouvrez http://localhost:3000.

## Mise en ligne

1. Déployez sur Vercel (ou tout hébergeur Next.js) et renseignez les variables de `.env.example`.
2. Dans Stripe, créez un webhook vers `https://<votre-domaine>/api/webhooks/stripe` pour l'événement `checkout.session.completed`, et copiez son secret dans `STRIPE_WEBHOOK_SECRET`.
3. Vérifiez les IDs `CUSTOM_*_BLUEPRINT_ID` / `CUSTOM_*_PROVIDER_ID` dans le catalogue Printify.

## Organisation du code

| Dossier | Rôle |
| --- | --- |
| `src/app` | Pages (accueil, collections, produit, personnaliser, panier, merci) et routes API |
| `src/lib/printify.ts` | Appels à l'API Printify (produits, catalogue, images, commandes) |
| `src/lib/shipping.ts` | Adresse de livraison prédéfinie |
| `src/lib/custom-bases.ts` | Vêtements proposés à la personnalisation |
| `src/components` | Panier, personnalisation, fiches produit |
