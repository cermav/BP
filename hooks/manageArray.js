
const manageArray = (arr, action) => {
  switch (action.type) {
    case "add":
      return [...arr, action.value];
    case "updatePropertyByKey":
      const {key, value, newProperty} = action;
      const index = arr.findIndex(item => item[key] === value);
      let newArr = [...arr];
     // console.log(newArr[index]);
      newArr[index] = {...newArr[index], [newProperty.key]: newProperty.value}
      return newArr;  
    case "remove":
      return arr.filter((item) => item !== action.value);
    case "removeByKey":
      return arr.filter((item) => item[action.key] !== action.value);  
    case "empty":
      return [];  
    default:
      return arr;
  }
}
export default manageArray;
