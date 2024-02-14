 import React, { useState, useEffect, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import axios from "axios";

import { fetchTitle, fetchUserTitle } from "../../http.js";
import { loginUser, logoutUser, getLocation } from "../../store2/loginUser.js";
import { searchPosts } from "../../store2/post.js";

import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import Card from "../../components/UI/Card";
/////////////////////////////////////////////////////////
import usePostSearch from "../../utils/infiScroll.js";
//////////
const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => (state.user ? state.user.user : null));
  ////////

  return (
    <div>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};


const BasicTabs = ({ isPreview }) => {
  const [value, setValue] = useState(0);
  const [pageNumber, setPageNumber] = useState(2);
 
 const dispatch = useDispatch();
 
 // search 부분 삭제

const {
  boards,
  hasMore,
  loading,
  error
} = usePostSearch(pageNumber)

const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // 스크롤이 끝에 닿았고 추가 데이터가 있을 때만 페이지 번호를 증가시킴
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );


  

  const navigate = useNavigate();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    
    <div sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="교환"
            {...a11yProps(0)}
            sx={{ fontWeight: value === 0 ? 600 : 400 }}
          />
          <Tab
            label="판매"
            {...a11yProps(1)}
            sx={{ fontWeight: value === 1 ? 600 : 400 }}
          />
        </Tabs>
      </Box>
      <div>전체 게시글</div>
      <CustomTabPanel value={value} index={0}>
        {boards.length === 0 ? (
          <div className="no-content">게시글이 없습니다.</div>
        ) : (
          <div
            style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
          >
            {boards.map((post, index) => (
              <div key={index}>
                <Card
                  id={post.id}
                  title={post.title}
                  images={'https://photocardforme.s3.ap-northeast-2.amazonaws.com/' + post.imageUrl}
                  ownMembers={post.ownMember}
                  targetMembers={post.targetMember}
                  isBartered={post.Bartered}
                  onClick={() => {
                    setSelectedPostId(post.id)
                    navigate(`/barter/${post.id}`); // 디테일 페이지로 이동
                  }} // 클릭 이벤트 추가
                  
                />
                {/* 마지막 요소일 때만 ref를 전달합니다 */}
                {index === boards.length - 1 ? <div ref={lastBookElementRef} /> : null}
              </div>
            ))}
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div
          style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
        >
          {boards.filter((post) => post.type === "판매").length === 0 ? (
            <div className="no-content">게시글이 없습니다.</div>
          ) : (
            boards
              .filter((post) => post.type === "판매")
              .map((post, index) => (
                <Card
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  images={post.images}
                  content={post.content}
                  ownMembers={post.ownMembers}
                  type={post.type}
                  isSold={post.isSold}
                ></Card>
              ))
          )}
        </div>
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </CustomTabPanel>
    </div>
    
  );
};

export default BasicTabs;