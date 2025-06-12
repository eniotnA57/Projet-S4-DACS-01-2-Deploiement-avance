const axios = require('axios');

/**
 * Nettoie un nom de paire en un handle Wethenew valide
 */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/'07/g, '07')           // remplace l’apostrophe '07 → 07
    .replace(/['’]/g, '')            // supprime autres apostrophes
    .replace(/[^a-z0-9]+/g, '-')     // remplace les espaces et symboles par des -
    .replace(/^-+|-+$/g, '');        // supprime les tirets en début/fin
}

async function fetchWethenewImageFromApi(rawNameOrHandle) {
  const handle = slugify(rawNameOrHandle);

  try {
    const response = await axios.post(
      'https://checkout.wethenew.com/api/2025-04/graphql.json',
      {
        operationName: 'productByHandle',
        query: `
          query productByHandle($handle: String!, $language: LanguageCode, $country: CountryCode) 
          @inContext(language: $language, country: $country) {
            product(handle: $handle) {
              title
              featuredImage {
                url
              }
            }
          }
        `,
        variables: {
          handle,
          country: 'FR',
          language: 'FR'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-shopify-storefront-access-token': '69e21e4f3e3333ff802f6a920c5ca4d5'
        }
      }
    );

    const product = response.data?.data?.product;

    if (!product) {
      console.warn(`[Wethenew] Aucun produit trouvé pour handle : ${handle}`);
    } else {
      console.log(`[Wethenew] Produit trouvé :`, product.title);
      console.log(`[Wethenew] Image URL :`, product.featuredImage?.url);
    }

    return product?.featuredImage?.url || '';
  } catch (err) {
    console.error(`❌ Erreur API Wethenew pour "${handle}" :`, err.message);
    return '';
  }
}

module.exports = fetchWethenewImageFromApi;
