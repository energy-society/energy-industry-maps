const BROWN = '#603e1e'

export const TAXONOMY_COLORS = {
  'Academia/Research': '#07a4bc',
  'Accelerator/Incubator': '#c30',
  'Biofuels': '#7cc908',
  'Buildings': '#036',
  'Chemistry': '#c94208',
  'Circular Economy': '#5a8925',
  'Construction': BROWN,
  'Enabling Technology/Components': BROWN,
  'Energy Systems/Management': '#40a22a',
  'Engineering': BROWN,
  'Environmental Remediation': '#89256e',
  'Evaluation/Compliance': '#9e4e16',
  'Finance': '#269e11',
  'Generation/Transmission': '#f80',
  'Geology': '#9e4e16',
  'Hydrogen': '#2cf',
  'IIoT/IoT': '#a92278',
  'Lighting': '#f4f390',
  'Manufacturing': '#7b16ce',
  'Materials': '#7b16ce',
  'Media': '#d11265',
  'Mobility as a Service': '#b75e35',
  'Nuclear': '#f0f',
  'Oil and Gas': '#ce3b16',
  'Policy': '#660',
  'Professional Services': '#164d82',
  'Security/Cybersecurity': '#2c86f4',
  'Sensors': '#dd4465',
  'Solar': '#fce119',
  'Storage': '#093',
  'Sustainable Agriculture': '#898925',
  'Thermal Energy': '#bc6d4b',
  'Utility/Grid': '#f4a41a',
  'Wave/Water/Hydro': '#20dbdb',
  'Wind': '#167d7f',
};

export const DISPLAY_CATEGORIES = Object.keys(TAXONOMY_COLORS);

// Last entry is fallthrough color
export const CIRCLE_COLORS = Object.entries(TAXONOMY_COLORS).flat().concat(['#ccc']);
