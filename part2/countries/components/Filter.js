import React from 'react';
const Filter = ({handleNFindeCountry, newFilter }) => {
    return (        
        <div>
       Find countries : <input value = {newFilter } onChange={ handleNFindeCountry }/>
       </div>
     );
}
 
export default Filter;
