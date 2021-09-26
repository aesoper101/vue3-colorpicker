module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --cache --fix", "prettier --write"],
  "*.{css,scss,less,sass}": ["stylelint --cache --fix", "prettier --write"],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write", "stylelint --fix"],
  "*.{scss,less,styl,html,css}": ["stylelint --fix", "prettier --write"],
  "*.md": ["prettier --write"],
};
