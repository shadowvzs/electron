// capitalize the 1st letter
export const capitalize = (t) => t[0].toUpperCase() + t.substr(1);

// underscore to capitalized word
export const u2capitalize = (t) => t.replace(/(^|_)./g, s => s.slice(-1).toUpperCase());

// replace capital letter to underscore+lowercase
export const c2underscore = (x) => x.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

// replace capital letter to dash+lowercase
export const c2dashed = (x) => x.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
// dash to capitalized word
export const d2capitalize = (t) => t.replace(/(^|\-)./g, s => s.slice(-1).toUpperCase());
