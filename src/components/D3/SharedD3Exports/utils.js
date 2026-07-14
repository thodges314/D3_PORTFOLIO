export function debounce(cb, delay = 50) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

// export const dataFieldsByColumn = {
//   category: 'dpa_main.product_name',
//   element: 'dpa_main.marketing_name',
//   value: 'dpa_main.label',
//   statRelevance: 'dpa_main.zscore',
//   index: 'dpa_main.index',
//   elementCode: 'dpa_main.element',
//   clientPercentage: 'dpa_main.client_pct_from_param',
//   targetPercentage: 'dpa_main.reference_pct_from_param',
//   zscore: 'dpa_main.zscore',
// };
