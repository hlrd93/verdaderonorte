import React, { useState } from "react"
import Modal from "react-modal"
import { useQuery, gql } from '@apollo/client'
import axios from 'axios'
import env from "react-dotenv"
import './App.css'

let GET_TASKLIST = gql`
  query tasklist($n: Int) {
    tasklist(n: $n)
  }
`

function App() {
  const { loading, error, data, refetch } = useQuery(GET_TASKLIST, {
    variables: { n: 3 },
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDone, setIsOpenDone] = useState(false)
  const [task, setTask] = useState({})
  const [inputValue, setInputValue] = useState('')

  if (loading) return <p> Loading... </p>
  if (error) return <p> Error get tasklist. </p>

  const openModal = (i) => {
    setTask(i)
    setIsOpen(true)
  }

  const closeModal = () => {
    setTask({})
    setIsOpen(false)
  }

  const closeModalDone = () => {
    setTask({})
    setIsOpenDone(false)
  }

  const doneTask = (task) => {
    axios.put(env.SERVER + "task", task).then(() => {
      console.log("done!!")
      setTask({})
      setIsOpen(false)
      setIsOpenDone(true)
    })
  }

  return (
    <>
      <div className="container1">
        <input
          className="css-input"
          placeholder="Number of task"
          type="number"
          min="0"
          onChange={(e) => setInputValue(e.target.valueAsNumber)}
        />
        <button className="super-button" onClick={() => refetch({ n: inputValue })}>
          GET
        </button>
      </div>
      <div className="container2">
        {data?.tasklist.map((i, index) => {
          return (
            <div key={index} index={index}>
              <button className="super-button" onClick={() => openModal(i)}>
                <div>Task #{i.UUID}</div>
                <div>{i.task}</div>
              </button>
            </div>
          )
        })}
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div>TASK#{task.UUID} - {task.task}</div>
        <div className="container3">
          <button onClick={() => doneTask(task)}>Complete</button>
          <button onClick={closeModal}>Close modal</button>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenDone}
        onRequestClose={closeModalDone}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div>DONE!!!</div>
        <div className="container3">
          <button onClick={closeModalDone}>Close modal</button>
        </div>
      </Modal>
    </>
  )
}

export default App
