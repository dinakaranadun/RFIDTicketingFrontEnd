import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Drawer from '../drawer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { getUserInfo, getForumPost, submitForumQuestion, updateForumPost, deleteForumPost } from '../api';
import AppBarComponent from '../appbar';



const defaultTheme = createTheme();
const ToolbarContent = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Heading = styled(Typography)({
  fontWeight: 'bold',
});

const SubHeading = styled(Typography)({
  fontWeight: '500',
});

const StyledButton = styled(Button)({
  borderRadius: '20px',
  padding: '5px 10px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#0096FF',
    color: 'white',
  },
});

const StyledCard = styled(Card)({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: '#E5E4E2',
  },
});

const StyledAvatar = styled(Avatar)({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#0096FF', 
    },
    '&:hover fieldset': {
      borderColor: '#0096FF', 
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0096FF', 
    },
  },
});

const Forum = () => {
  const [open, setOpen] = useState(true);
  const [forumPosts, setForumPosts] = useState([]);
  const [myForumPosts, setMyForumPosts] = useState([]);
  const [startDiscussionOpen, setStartDiscussionOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredMyPosts, setFilteredMyPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await getForumPost();
        const token = localStorage.getItem('token');
        const userInfo = await getUserInfo(token);
        const userPosts = response.filter(post => post.passenger.id === userInfo.id);
        const otherPosts = response.filter(post => post.passenger.id !== userInfo.id);
        setForumPosts(otherPosts);
        setMyForumPosts(userPosts);
        setFilteredPosts(otherPosts);
        setFilteredMyPosts(userPosts);
      } catch (error) {
        console.error('Error fetching forum posts:', error);
      }
    };

    fetchForumPosts();
  }, []);

  useEffect(() => {
    const filteredOtherPosts = forumPosts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredUserPosts = myForumPosts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredPosts(filteredOtherPosts);
    setFilteredMyPosts(filteredUserPosts);
  }, [searchQuery, forumPosts, myForumPosts]);

  const handleStartDiscussionOpen = () => {
    setStartDiscussionOpen(true);
  };

  const handleStartDiscussionClose = () => {
    setStartDiscussionOpen(false);
  };

  const handleDeleteConfirmationOpen = (postId) => {
    setPostToDelete(postId);
    setDeleteConfirmationOpen(true);
  };
  
  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
    setPostToDelete(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const submitQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      const userInfo = await getUserInfo(token);
      const data = {
        title: question,
        category,
        content,
        passenger_id: userInfo.id,
      };
      const response = await submitForumQuestion(data);
      console.log('Question submitted successfully:', response);
      setStartDiscussionOpen(false);
      const updatedForumPosts = await getForumPost();
      const userPosts = updatedForumPosts.filter(post => post.passenger.id === userInfo.id);
      const otherPosts = updatedForumPosts.filter(post => post.passenger.id !== userInfo.id);
      setForumPosts(otherPosts);
      setMyForumPosts(userPosts);
      setFilteredPosts(otherPosts);
      setFilteredMyPosts(userPosts);
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handlePostClick = (postId) => {
    const post = [...forumPosts, ...myForumPosts].find((post) => post.id === postId);
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handleCategoryFilter = (categoryFilter) => {
    if (categoryFilter === 'all') {
      setFilteredPosts(forumPosts);
      setFilteredMyPosts(myForumPosts);
    } else {
      const filteredOther = forumPosts.filter((post) => post.category === categoryFilter);
      const filteredMine = myForumPosts.filter((post) => post.category === categoryFilter);
      setFilteredPosts(filteredOther);
      setFilteredMyPosts(filteredMine);
    }
  };

  const handleEditPostOpen = (post) => {
    setEditPost(post);
    setQuestion(post.title);
    setCategory(post.category);
    setContent(post.content);
    setStartDiscussionOpen(true);
  };

  const handleEditPostClose = () => {
    setEditPost(null);
    setQuestion('');
    setCategory('');
    setContent('');
    setStartDiscussionOpen(false);
  };

  const updatePost = async () => {
    try {
      const data = {
        title: question,
        category,
        content,
      };
      await updateForumPost(editPost.id, data);
      const updatedForumPosts = await getForumPost();
      const userPosts = updatedForumPosts.filter(post => post.passenger.id === editPost.passenger.id);
      const otherPosts = updatedForumPosts.filter(post => post.passenger.id !== editPost.passenger.id);
      setForumPosts(otherPosts);
      setMyForumPosts(userPosts);
      setFilteredPosts(otherPosts);
      setFilteredMyPosts(userPosts);
      handleEditPostClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteForumPost(postId);
    
        window.location.reload(); 
     
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
        <Drawer open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
              <Heading variant="h6" gutterBottom>
                  Browse by Category:
                </Heading>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleCategoryFilter('General')}
                  >
                    General
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleCategoryFilter('RFID Apps')}
                  >
                    RFID App
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleCategoryFilter('Other')}
                  >
                    Other
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleCategoryFilter('all')}
                  >
                    All
                  </StyledButton>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    onClick={handleStartDiscussionOpen}
                    variant="contained"
                    color="primary"
                    sx={{
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.primary.dark,
                      },
                    }}
                  >
                    Start Discussion
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Heading variant="h6">My Posts</Heading>
              </Grid>
              {filteredMyPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <StyledCard
                    sx={{
                      mb: 2,
                    }}
                    onClick={() => handlePostClick(post.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledAvatar
                          alt={post.passenger.fName}
                          src="/static/images/avatar/1.jpg"
                        />
                        <Box sx={{ ml: 2 }}>
                          <SubHeading variant="h6">
                            {post.passenger.fName + " " + post.passenger.lName}
                          </SubHeading>
                        </Box>
                      </Box>
                      <Box sx={{ my: 3 }}>
                        <Heading variant="h6">{post.title}</Heading>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(post.created_at), 'MM/dd/yyyy')}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPostOpen(post);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirmationOpen(post.id);
                          }}
                        >
                          Delete
                        </Button>

                        <Dialog
                          open={deleteConfirmationOpen}
                          onClose={handleDeleteConfirmationClose}
                          TransitionComponent={Transition}
                        >
                          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                          <DialogActions>
                            <Button onClick={handleDeleteConfirmationClose} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={(e) => {
                              e.stopPropagation();
                              deletePost(postToDelete)
                              }} 
                              color="secondary">
                            
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Heading variant="h6">Other Posts</Heading>
              </Grid>
              {filteredPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <StyledCard
                    sx={{
                      mb: 2,
                    }}
                    onClick={() => handlePostClick(post.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledAvatar
                          alt={post.passenger.fName}
                          src="/static/images/avatar/1.jpg"
                        />
                        <Box sx={{ ml: 2 }}>
                          <SubHeading variant="h6">
                            {post.passenger.fName + " " + post.passenger.lName}
                          </SubHeading>
                        </Box>
                      </Box>
                      <Box sx={{ my: 3 }}>
                        <Heading variant="h6">{post.title}</Heading>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(post.created_at), 'MM/dd/yyyy')}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Container>
          <Dialog
            open={startDiscussionOpen}
            onClose={editPost ? handleEditPostClose : handleStartDiscussionClose}
            TransitionComponent={Transition}
          >
            <DialogTitle>{editPost ? 'Edit Post' : 'Start a Discussion'}</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="RFID Apps">RFID App</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Content"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 2 }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={editPost ? handleEditPostClose : handleStartDiscussionClose} color="primary">
                Cancel
              </Button>
              <Button onClick={editPost ? updatePost : submitQuestion} variant="contained" color="primary">
                {editPost ? 'Update' : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={!!selectedPost}
            onClose={handleClosePost}
            TransitionComponent={Transition}
          >
            <DialogTitle><Heading variant="h6">{selectedPost && selectedPost.title}</Heading></DialogTitle>
            <DialogContent>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{selectedPost && selectedPost.content}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Heading variant="h6">Replies :</Heading>
                </CardContent>
              </Card>
              {selectedPost &&
                selectedPost.answers &&
                selectedPost.answers.map((answer, index) => (
                  <Card sx={{ mb: 2 }} key={index}>
                    <CardContent>
                      <Typography variant="body1">{answer.content}</Typography>
                    </CardContent>
                  </Card>
                ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePost} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Forum;
