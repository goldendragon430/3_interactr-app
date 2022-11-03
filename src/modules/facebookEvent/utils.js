/**
 * A list of facebook pixel events that can be
 * used in a select list component
 * @type {{Purchase: string, AddToWishlist: string, AddToCart: string, AddPaymentInfo: string, StartTrial: string, InitiateCheckout: string, Subscribe: string, SubmitApplication: string, Contact: string, trackCustom: string, CompleteRegistration: string, Donate: string, Schedule: string, Search: string, Lead: string, CustomizeProduct: string, ViewContent: string, FindLocation: string}}
 */
export const FacebookPixelEvents = {
  'trackCustom' : 'Custom Event ',
  'ViewContent' : 'View Content',
  'Lead' : 'Lead',
  'Purchase' : 'Purchase',
  'AddToCart' : 'Add To Cart',
  'InitiateCheckout' : 'Initiate Checkout',
  'AddPaymentInfo': 'Add Payment Info',
  'AddToWishlist' : 'Add To Wishlist',
  'CompleteRegistration' : 'Complete Registration',
  'Contact' : 'Contact',
  'CustomizeProduct' : 'Customize Product',
  'Donate' : 'Donate',
  'FindLocation' : 'Find Location',
  'Schedule' : 'Schedule',
  'Search' : 'Search',
  'StartTrial' : 'Start Trial',
  'SubmitApplication' : 'Submit Application',
  'Subscribe' : 'Subscribe',
};

/**
 * Some facebook events have suggested params for the meta data so can
 * list them here.
 * @type {{Purchase: string, StartTrial: string, Subscribe: string}}
 */
export const DefaultMetaData = {
  'Purchase' : "{value: 0.00, currency: 'USD'}",
  'StartTrial' : "{value: '0.00', currency: 'USD', predicted_ltv: '0.00'}",
  'Subscribe' : "{value: '0.00', currency: 'USD', predicted_ltv: '0.00'}"
};