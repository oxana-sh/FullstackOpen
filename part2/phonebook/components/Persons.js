import React from 'react';
const Persons = ({persons,personToShow}) => {
        return ( 
        <div>
              <ul>
        {personToShow.map(person => 
          <li key = {person.id}>{person.name} <b>{person.number}</b></li>
        )}
      </ul>
        </div>
     );
}
 
export default Persons;
