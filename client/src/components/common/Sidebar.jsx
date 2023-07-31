import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate, useParams } from 'react-router-dom'
import assets from '../../assets/index'
import { useEffect, useState, useSyncExternalStore } from 'react'
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import FavouriteList from './FavouriteList'
import { setMode } from '../../redux/modeSlice'

const Sidebar = () => {
  const user = useSelector((state) => state.user.value)
  const boards = useSelector((state) => state.board.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true);
  const [isSidebar, setIsSidebar] = useState(false);
  const mode = useSelector((state) => state.mode.value);

  const secondary = mode ? assets.colors.secondary_dark : assets.colors.secondary_light;
  const tertiary = mode ? assets.colors.tertiary_dark : assets.colors.tertiary_light;

  const sidebarWidth = 250
  console.log(boards);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
        setLoading(false);
      } catch (err) {
        alert("sidebar error")
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const activeItem = loading ? undefined : boards.findIndex(e => e.id === boardId);
    console.log(activeIndex);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`)
    }
    setActiveIndex(activeItem)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e.id === boardId)
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePositoin({ boards: newList })
    } catch (err) {
      alert("another sidebar error")
    }
  }

  const addBoard = async () => {
    try {
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert("sidebar err 2")
    }
  }

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        height: "100vh",
        "& > div": { borderRight: "none" },
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: "100vh",
          backgroundColor: secondary,
          color: tertiary,
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>

            <IconButton onClick={() => dispatch(setMode())} >
              {mode ? 
              <DarkModeIcon
                fontSize="small"
                style={{ color: tertiary }} 
              /> : 
              <LightModeIcon
                fontSize="small"
                style={{ color: tertiary }}
              />}
            </IconButton>
            
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon
                fontSize="small"
                style={{ color: tertiary }}
              />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: "10px" }} />
        <FavouriteList />
        <Box sx={{ paddingTop: "10px" }} />
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              Personal
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon
                fontSize="small"
                style={{ color: tertiary }}
              />
            </IconButton>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            key={"list-board-droppable-key"}
            droppableId={"list-board-droppable"}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {loading
                  ? "load ho raha hai"
                  : boards.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItemButton
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={index === activeIndex}
                            component={Link}
                            to={`/boards/${item.id}`}
                            sx={{
                              pl: "20px",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.icon} {item.title}
                            </Typography>
                          </ListItemButton>
                        )}
                      </Draggable>
                    ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  );
}

export default Sidebar