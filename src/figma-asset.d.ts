declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

declare module 'figma:asset/*.png' {
  const src: string;
  export default src;
}

declare module 'figma:*' {
  const src: string;
  export default src;
}
