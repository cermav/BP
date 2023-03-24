export const convertToSearch = (str) => {
//  console.log(str)
  str = str.toLowerCase();
//  str = str.normalize("NFD"); // normilization doesnt work WTF?

  str = str.replace(new RegExp(/ě/g),"e");
  str = str.replace(new RegExp(/š/g),"s");
  str = str.replace(new RegExp(/č/g),"c");
  str = str.replace(new RegExp(/ř/g),"r");
  str = str.replace(new RegExp(/ž/g),"z");
  str = str.replace(new RegExp(/ý/g),"y");
  str = str.replace(new RegExp(/á/g),"a");
  str = str.replace(new RegExp(/í/g),"i");
  str = str.replace(new RegExp(/é/g),"e");
  str = str.replace(new RegExp(/ď/g),"d");
  str = str.replace(new RegExp(/ť/g),"t");
  str = str.replace(new RegExp(/ň/g),"n");
  str = str.replace(new RegExp(/ů/g),"u");
  str = str.replace(new RegExp(/ú/g),"u");

//  console.log(str)
  return str;
}
