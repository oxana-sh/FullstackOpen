import React from 'react';
const PersonForm = (props) => {
       
    return (
        <div>
        <form>
                <div>
                Name: <input value = {props.newName}  onChange={props.handleNameChange} />
                </div>
                <div>
                Phone number: <input value = {props.newNumber}  onChange={props.handleNumberChange} />
                </div>
                <div>
                <button type="submit" onClick = {props.addPerson} >add</button>
                </div>
            </form>

        </div>
      );
}
 
export default PersonForm ;
