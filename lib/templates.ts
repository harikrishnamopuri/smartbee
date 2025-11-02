export type Template = {
  id: string;
  name: string;
  className: string;
  thumb: string;
};

export const templates: Template[] = [
  {
    id: 'amber-gradient',
    name: 'Amber Gradient',
    className: 'template-amber-gradient',
    thumb: '/template-thumbs/amber.svg',
  },
  {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    className: 'template-ocean-wave',
    thumb: '/template-thumbs/ocean.svg',
  },
  {
    id: 'abstract-photo',
    name: 'Abstract Photo',
    className: 'template-abstract-photo',
    thumb: '/template-thumbs/abstract.svg',
  },
];

export default templates;
