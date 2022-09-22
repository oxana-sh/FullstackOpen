import React from 'react';
const Persons = ({personToShow, removePerson}) => {
        return ( 
        <div>
              <ul>
        {personToShow.map(person => 
          <li key = {person.id}>{person.name} <b>{person.number}</b> <button onClick={ ()=> removePerson(person.id)}>del</button></li>
          
        )}
      </ul>
        </div>
     );
}
 
export default Persons;
