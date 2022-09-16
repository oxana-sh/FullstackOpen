import React from 'react';
const Filter = (props) => {
    return (        
       <>
       Filter shown with : <input  value={props.filter} onChange={props.handlePersonFind}/> 
     
        </>
     );
}
 
export default Filter;
