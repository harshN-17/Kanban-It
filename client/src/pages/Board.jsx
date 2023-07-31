import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
// import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/Kanban'
import { setBoards } from '../redux/boardSlice'
import { setFavouriteList } from '../redux/favouriteSlice'

import { io } from 'socket.io-client'
import assets from '../assets'

let timer
const timeout = 500

const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')
  const [socket, setSocket] = useState(null);
  
  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourite.value);
  const user = useSelector((state) => state.user.value);
  const load = useSelector((state) => state.loader.value);

  const mode = useSelector((state) => state.mode.value);

  const tertiary = mode ? assets.colors.tertiary_dark : assets.colors.tertiary_light;
  const misc = mode ? assets.colors.misc_dark : assets.colors.misc_light;


  // console.log(load);

  // console.log(favouriteList)

  // useEffect(() => {
  //   setSocket(io("ws://localhost:8000")); 
  // }, [])

  // useEffect(() => {
  //   socket?.on("welcome",message => {console.log(message)})
  // }, [socket])
  
  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourite)
        setIcon(res.icon)
      } catch (err) {
        alert('getboard' + err)
      }
    }
    getBoard()
  }, [boardId])

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
      dispatch(setFavouriteList(tempFavourite))
    }

    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      alert(err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
      dispatch(setFavouriteList(tempFavourite))
    }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite })
      let newFavouriteList = [...favouriteList]
      console.log(newFavouriteList)
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
      } else {
        newFavouriteList.unshift(board)
      }
      dispatch(setFavouriteList(newFavouriteList))
      setIsFavourite(!isFavourite)
    } catch (err) {
      alert(err)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
        dispatch(setFavouriteList(newFavouriteList))
      }

      const newList = boards.filter(e => e.id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
      } else {
        navigate(`/boards/${newList[0].id}`)
      }
      dispatch(setBoards(newList))
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon style={{ tertiary }} />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        padding: '10px 50px',
      }}>
        <Box>
          {/* emoji picker */}
          {/* <EmojiPicker icon={icon} onChange={onIconChange} /> */}
          <TextField
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700', color: misc }
            }}
          />
          <TextField
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem', color: tertiary },
            }}
          />
          {/* <Box>Editors: {user.username}</Box> */}
        </Box>
        <Box>
          {/* Kanban board */}
          <Kanban data={sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  )
}

export default Board