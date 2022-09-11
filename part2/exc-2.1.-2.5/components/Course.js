import React from 'react'

const Course = ({ course } ) => {   
   // const totalExercise = course.parts.reduce((s, p) => p.exercises);
   console.log(course[0].parts);   
       return (         
        course.map((item,index) => (
            <section className="course" key={item.id}>
                <h2>{item.name}</h2>
                <span className="part">
                {item.parts.map(part => (
                    <div key={part.id}>
                        <p>{part.name} <b>{part.exercises}</b></p>                      
                    </div>
                ))}
                 </span>  
               <h3>Total : {item.parts.reduce((s, p) => s + p.exercises, 0)} </h3> <hr></hr>               
            </section>
           )
        )
       
     );
}
 
export default Course;
