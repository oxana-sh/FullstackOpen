import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('');
  const [persons, setPersons] = useState([]);

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }
  useEffect(hook, [])
  
  const personToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleNameChange = (e) => {
    setNewName(e.target.value)
     }
  const handleNumberChange = (e) => {
      setNewNumber(e.target.value)
    }
    const handlePersonFind = (e) => {
      setFilter(e.target.value)
    }

  const addPerson = (e) => {
    e.preventDefault() 
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,}
      
    const existName  =  (persons.filter(p => p.name === newName).length > 0) ?
    () => alert(`${newName} is already added to phonebook`): 
    () => setPersons(persons.concat(personObject));
    existName()     
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter = {filter} handlePersonFind = {handlePersonFind} />
      <h2>Add New</h2>
      <PersonForm persons = {persons}  newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange} addPerson = {addPerson}/>    
      <h2>Numbers</h2>
      <Persons  persons = {persons} personToShow = {personToShow} />    
    </div>
  )
}

export default App
