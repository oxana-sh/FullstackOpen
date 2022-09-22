import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import PersonAdmin from './services/persons'
const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('');
  const [persons, setPersons] = useState([]);
  const [message, setMessage] = useState(null);
  const [className, setClassName] = useState('')

  const personToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  useEffect(() => {
    PersonAdmin
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
   const handleNameChange = (e) => {
    setNewName(e.target.value)
     }
   const handleNumberChange = (e) => {
      setNewNumber(e.target.value)
    }
    const handlePersonFind = (e) => {
      setFilter(e.target.value)
    }


  const removePerson = id => {
    const person = persons.find(p => p.id === id)    
    const deletePerson = { ...person, id: person.id } 
    const confirm = window.confirm(`Are you sure you want to delete ${person.name}`) 
    if (confirm ) {    
      PersonAdmin
      .remove(id, deletePerson)
      .then(() => {
      setPersons(personToShow.filter(n => n.id !== id))    
    }) 
    .catch(error => {
      setMessage(
        `Information of '${person.name}' has already be remove from server`
      )
      setClassName('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }) 
  }  
  }
    const addPerson = (e) => {
    e.preventDefault() 
     
      const personObject = {
      name: newName,
      number: newNumber,
      }
      const existPerson = persons.find(p => p.name === newName.trim());  
      const updatePerson = { ... existPerson, number: newNumber }  
      
     if (existPerson) {
      const confirm = window.confirm(`${newName} is already added to phonebook. replace old number with new one?`)
      if(confirm){
       PersonAdmin
      .update(existPerson.id, updatePerson)
      .then(updatePerson  => {
        setPersons(persons.map(person => person.id !== existPerson.id ? person : updatePerson))      
        setNewName('')
        setNewNumber('')
        setMessage(
          `Update '${newName}' set new number '${newNumber}'`
        )
        setClassName('ok')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
     }
     } else{      
      PersonAdmin
      .create(personObject)
      .then(returnedPersons => {
        setPersons(personToShow.concat(returnedPersons))         
        setNewName('')
        setNewNumber('')
        setMessage(
          `Add '${newName}''`
        )
        setClassName('ok')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
     
  }
    
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} className = {className} />
      <Filter filter = {filter} handlePersonFind = {handlePersonFind} />
      <h2>Add New</h2>
      <PersonForm persons = {persons}  newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange} addPerson = {addPerson}/>    
      <h2>Numbers</h2>
      <Persons  persons = {persons}  removePerson = {removePerson} personToShow = {personToShow}/>    
    </div>
  )
}

export default App
