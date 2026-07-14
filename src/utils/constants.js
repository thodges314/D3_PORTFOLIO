export const LOOKER_MODEL = 'dpaappdev_dpa';
export const createCustomQueryBodyFilteredByAudience = (
  jobID,
  refAud,
  tgtAud
) => {
  const query = {
    model: LOOKER_MODEL,
    view: 'dpa_main',
    fields: [
      'dpa_main.element',
      'dpa_main.page',
      'dpa_main.subpage',
      'dpa_main.visualization',
      'dpa_main.id',
      'dpa_main.value',
      'dpa_main.label',
      'dpa_main.marketing_name',
      'dpa_main.index',
      'dpa_main.zscore',
      'dpa_main.significance',
      'dpa_main.product_name',
      'dpa_main.marketing_name',
      'dpa_main.product_category',
      'dpa_main.client_count_from_param',
      'dpa_main.reference_count_from_param',
      'dpa_main.reference_pct_from_param',
      'dpa_main.client_pct_from_param',
      'dpa_main.svg_icons',
      'dpa_main.duplicate',
      'dpa_main.show_more_look_id',
      'dpa_main.personicx_segment_color',
    ],
    filters: {
      'dpa_main.job_select_param': jobID,
      'dpa_main.reference_select_param': refAud,
      'dpa_main.target_select_param': tgtAud,
    },
  };

  return query;
};
export const createCustomQueryBodyFilteredByAudienceSelection = (
  jobID,
  refAud,
  tgtAud,
  page,
  subpage
) => {
  const query = {
    model: LOOKER_MODEL,
    view: 'dpa_main',
    fields: [
      'dpa_main.element',
      'dpa_main.page',
      'dpa_main.subpage',
      'dpa_main.visualization',
      'dpa_main.id',
      'dpa_main.value',
      'dpa_main.label',
      'dpa_main.marketing_name',
      'dpa_main.index',
      'dpa_main.zscore',
      'dpa_main.significance',
      'dpa_main.product_name',
      'dpa_main.marketing_name',
      'dpa_main.product_category',
      'dpa_main.client_count_from_param',
      'dpa_main.reference_count_from_param',
      'dpa_main.reference_pct_from_param',
      'dpa_main.client_pct_from_param',
      'dpa_main.svg_icons',
      'dpa_main.duplicate',
      'dpa_main.show_more_look_id',
      'dpa_main.personicx_segment_color',
    ],
    filters: {
      'dpa_main.job_select_param': jobID,
      'dpa_main.reference_select_param': refAud,
      'dpa_main.target_select_param': tgtAud,
      'dpa_main.page': page,
      'dpa_main.subpage': subpage,
    },
  };

  return query;
};

export const filterNullIndexElements = (data) => {
  const filteredData = data.filter((d) => d['dpa_main.index']);
  return filteredData;
};

export const filterDuplicateElements = (data) => {
  const filteredData = data.filter((d) => d['dpa_main.duplicate'] === 'FALSE');
  return filteredData;
};

export const createCustomQueryBodyOfAudiences = () => {
  const query = {
    model: LOOKER_MODEL,
    view: 'job_segment',
    fields: [
      'job_segment.job_id',
      'job_segment.name',
      'job_segment.segment_name',
      'job_segment.target_flg',
      'job_segment.reference_version',
      'job_segment.timestamp_date',
      'job_segment.tenant_id',
      'job_segment.tenant_name',
    ],
  };

  return query;
};
export const createCustomQueryBodyOfLayoutInstructions = (page, subpage) => {
  const query = {
    model: LOOKER_MODEL,
    view: 'layout',
    fields: [
      'layout.id',
      'layout.taxonomy_object',
      'layout.page',
      'layout.subpage',
    ],
    filters: {
      'layout.page': page,
      'layout.subpage': subpage,
    },
  };

  return query;
};

export const dataFieldsByColumn = {
  category: 'dpa_main.product_name',
  clientPercentage: 'dpa_main.client_pct_from_param',
  element: 'dpa_main.marketing_name',
  elementCode: 'dpa_main.element',
  icon: 'dpa_main.svg_icons',
  index: 'dpa_main.index',
  label: 'dpa_main.label',
  personixCategory: 'dpa_main.value',
  personicxColor: 'dpa_main.personicx_segment_color',
  referencePercentage: 'dpa_main.reference_pct_from_param',
  statRelevance: 'dpa_main.zscore',
  subPage: 'dpa_main.subpage',
  targetPercentage: 'dpa_main.client_pct_from_param',
  value: 'dpa_main.label',
  zscore: 'dpa_main.zscore',
};
