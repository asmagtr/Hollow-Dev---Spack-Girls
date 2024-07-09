
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [candidateId, setCandidateId] = useState('');
  const [voteId, setVoteId] = useState('');
  const [voteError, setVoteError] = useState('');
  const [candidateError, setCandidateError] = useState('');
  const navigate = useNavigate();

  const getwinner=async()=>{
    try {
      const result=await axiosInstance.get("/candidate/get-winner");
      console.log(result)
        alert(`${result.data.username} is winning with ${result.data.votes} votes`)
      
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        alert(error.response.data.message);
        return
      }
      alert("error try again later")
      
    }
  }

  const getUserInfo = async () => {
    try {
      const result = await axiosInstance.get('/user/me');
      setUserInfo(result.data.user);
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    // Fetch user info from an API endpoint
    getUserInfo();
    return () => {};
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();

    setVoteError('');
    // Implement vote functionality here
    try {
      const result = await axiosInstance.post('/vote/add-vote-by-username', {
        candidateUsername:voteId,
      });
      alert('Vote added successfully');
    } catch (error) {

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setVoteError(error.response.data.message);
      } else {
        setVoteError('An unexpected error occurred. Please try again.');
      }
      return;
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setCandidateError('');
    // Implement add candidate functionality here
    try {
      const result = await axiosInstance.post('/candidate/add-candidate-by-username', {
        candidateUsername:candidateId,
      });
      alert('Candidate added successfully');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setCandidateError(error.response.data.message);
      } else {
        setCandidateError('An unexpected error occurred. Please try again.');
      }
      return;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">User Info</h1>
        <p><strong>Name:</strong> {userInfo.fullName}</p>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Role:</strong> {userInfo.role}</p>
      </div>

      <div className="bg-white p-6 mt-12 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add a Candidate</h2>
        <form onSubmit={handleAddCandidate}>
          <label className="block text-gray-700 mb-2" htmlFor="candidateId">
            Enter the username of the user you want to add as a candidate:
          </label>
          <input
            type="text"
            id="candidateId"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="border rounded w-full py-2 px-3 mb-4"
            required
          />
          {candidateError && <p className="text-red-500 text-xs pb-1">{candidateError}</p>}
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 pt-2 rounded">
            Add
          </button>
        </form>
      </div>

      <div className="bg-white p-6 mt-12 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Vote for a Candidate</h2>
        <form onSubmit={handleVote}>
          <label className="block text-gray-700 mb-2" htmlFor="voteId">
            Enter the username of the candidate you want to vote for:
          </label>
          <input
            type="text"
            id="voteId"
            value={voteId}
            onChange={(e) => setVoteId(e.target.value)}
            className="border rounded w-full py-2 px-3 mb-4"
            required
          />
          {voteError && <p className="text-red-500 text-xs pb-1">{voteError}</p>}
          <button type="submit" className="bg-green-500 text-white py-2 mt-2 px-4 rounded">
            Vote
          </button>
        </form>
      </div>


      <div className="bg-blue-400 p-6 mt-12 rounded-lg shadow-md w-1/2 flex justify-center items-center">
      <button className="bg-blue-600 text-white py-4  mt-2 px-8 rounded mx-auto" onClick={getwinner}>
            see winner
          </button>
      </div>
    </div>
  );
};

export default Home;
