
const isObjectPropertyEmpty=(obj,data)=>{
    const updatedObject={...obj};
    for(property in obj){
     
        if(obj[property]===""||obj[property]===undefined){
            updatedObject[property]=data[property]
           
        }
        if (typeof obj[property]==='object') {
            for( subProperty in obj[property]){
                if(obj[property][subProperty]===""||obj[property][subProperty]===undefined){
                    updatedObject[property][subProperty]=data[property][subProperty]
                }
            
          }
    }
}
return updatedObject; 
}
module.exports=isObjectPropertyEmpty;
