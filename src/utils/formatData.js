/**
 * Get current user's info
 * @param {Array} arr        The array to be sorted
 * @param {String} keyName  The name of the key to be sorted by
 * @return {String}          The sorted object
 */
export const sortDataByInfoBaseElement = (arr, keyName) => {
  let sorted = {};
  for (let i = 0; i < arr.length; i++) {
    if (sorted[arr[i][keyName]] == undefined) {
      sorted[arr[i][keyName]] = [];
    }
    sorted[arr[i][keyName]].push(arr[i]);
  }

  return sorted;
};

export const createCustomQueryBody = () => {
  const query = {
    model: "rnd_acoemtadev_main",
    view: "mta_sample",
    fields: [
      "mta_sample.channel",
      "mta_sample.taxonomy_id",
      "mta_sample.bucket_control_level_name",
      "mta_sample.bucket_touch_count",
      "mta_sample.chan_type",
      "mta_sample.bucket_control_level",
      "mta_sample.bucket_cpc",
      "mta_sample.l1_l4",
      "mta_sample.l1",
      "mta_sample.scenario",
      "mta_sample.chan_control_type",
      "mta_sample.bucket_cost",
      "mta_sample.segment",
      "mta_sample.channel_optimal_bucket_level",
      "mta_sample.bucket_fract_conv",
      "mta_sample.chan_fract_conv",
      "mta_sample.l1_hex_color",
      "mta_sample.lost_conv",
      "mta_sample.maintained_conv"
    ],
  };

  return query;
};
