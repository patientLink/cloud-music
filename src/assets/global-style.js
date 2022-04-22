const extendClick = () => {
  return `
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: -10px; 
      bottom: -10px; 
      left: -10px;
      right: -10px;
    }
  `
}

const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `
}

const doubleOmitted = () => {
  return `
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `
}

export default {
  'theme-color': '#8193e8',
  'theme-color-shadow': 'rgba(129,147,232,.5)',
  'light-green-color': 'rgba(122,209,148)',
  'warning-color': '#ff0000',
  'warning-border-color': "#e19393",
  'font-color-dark': '#000',
  'font-color-light': '#f1f1f1',
  'font-color-desc': '#2E3030',
  'font-color-desc-v2': '#bba8af',// 略淡
  'font-color-desc-v3': '#2a3035',// 略淡
  'font-size-ss': '10px',
  'font-size-s': '12px',
  'font-size-m': '14px',
  'font-size-l': '16px',
  'font-size-ll': '18px',
  'font-size-xl': '20px',
  'font-size-xxl': '22px',
  'font-size-xxxl': '24px',
  "border-color": '#e4e4e4',
  'background-color': '#f2f3f4',
  'background-cover-color': 'rgba(0, 0, 0, .3)',
  'background-color-shadow': 'rgba(0, 0, 0, 0.3)',
  'highlight-background-color': '#fff',
  'border-color-grey': 'rgba(208, 208, 199, .6)',
  extendClick,
  noWrap,
  doubleOmitted
}