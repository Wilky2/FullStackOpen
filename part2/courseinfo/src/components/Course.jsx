const Header = ({course}) =>{
  console.log(course)
  return (
    <h2>{course}</h2>
  )
}

const Part = ({part}) =>{
  console.log(part)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({parts}) =>{
  console.log(parts)
  return(
    <>
      {parts.map(part=><Part key={part.id} part={part}/>)}
    </>
  )
}

const Total = ({parts}) =>{
  console.log(parts)
  const total = parts.reduce((total, part)=>total + part.exercises,0)
  return (
    <p>total of {total} exercises</p>
  )
}

const Course = ({course})=>{
  console.log(course)
   return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course