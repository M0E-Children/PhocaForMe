import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addSearchData } from "../../store2/search.js";

import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { useTheme } from "@mui/material/styles";

import { Button } from "../UI/Button.jsx";
import RadioButton2 from "../UI/RadioButton.jsx";
import BarterWrite2 from "../../components/PostWrite/BarterWrite2.jsx";
import SellWrite2 from "../../components/PostWrite/SellWrite2.jsx";
import TypeDropdown2 from "../UI/Dropdown/TypeDropdown2.jsx";

const Search = function () {
  const [userInput, setUserInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isExchange, setIsExchange] = useState(true);
  const [targetMembers, setTargetMembers] = useState([]);
  const [ownMembers, setOwnMembers] = useState([]);
  const [targetMembersInput, setTargetMembersInput] = useState(null);
  const [ownMembersInput, setOwnMembersInput] = useState(null);
  const [cardType, setCardType] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const handleTypeChange = (cardType) => {
    if (cardType == null) {
      cardType = {
        value: "",
        label: "",
      };
    }
    setCardType(cardType);
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  function onClick() {
    setIsClicked((prevIsClicked) => !prevIsClicked);
  }

  const handleOwnMemberSelection = (members) => {
    setOwnMembers(members);
  };

  const handleTargetMemberSelection = (members) => {
    setTargetMembers(members);
  };

  function onExchangeChange(value) {
    setIsExchange(value === "option1");
  }

  function handleSearchClick() {
    let userInputCondition = {};

    // 사용자가 입력한 값이 있으면 검색 조건에 추가
    if (userInput) {
      userInputCondition = { userInput: userInput };
    }

    const searchData = {
      ownMembers: ownMembers.length > 0 ? ownMembers[0].value : ownMembersInput,
      targetMembers:
        targetMembers.length > 0 ? targetMembers[0].value : targetMembersInput,
      cardType: cardType ? cardType.value : null,
      ...userInputCondition,
    };

    console.log(searchData);
    dispatch(addSearchData(searchData));
    navigate("/post");
  }

  const handleUserInputClick = (event) => {
    event.stopPropagation(); // 클릭 이벤트 버블링 중단
  };

  return (
    <div id="search-container">
      <h3>어떤 포카를 찾으시나요?</h3>

      <div id="search-option-container">
        {!isClicked ? (
          <div style={{ position: "relative" }}>
            <input
              id="title-input"
              value={userInput}
              onChange={handleUserInputChange}
              variant="outlined"
              placeholder="앨범, 버전명 등을 입력해주세요"
              style={{ paddingLeft: "10vw" }}
            />
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                left: "3vw",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            />
            <IoIosArrowDown
              onClick={onClick}
              style={{
                position: "absolute",
                top: "50%",
                right: "3vw",
                transform: "translateY(-50%)",
              }}
            />
          </div>
        ) : (
          <div id="search-container">
            <div style={{ position: "relative" }}>
              <input
                id="title-input"
                value={userInput}
                onChange={handleUserInputChange}
                variant="outlined"
                placeholder="앨범, 버전명 등을 입력해주세요"
                style={{ paddingLeft: "10vw" }}
              />
              <FaSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "3vw",
                  transform: "translateY(-50%)",
                  color: "gray",
                }}
              />
              <IoIosArrowDown
                onClick={onClick}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "3vw",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            <div>
              {isExchange ? (
                <BarterWrite2
                  onChange={(ownMembers, targetMembers) => {
                    handleOwnMemberSelection(ownMembers);
                    handleTargetMemberSelection(targetMembers);
                  }}
                />
              ) : (
                <SellWrite2 />
              )}
            </div>
            <div>
              <h3>포토카드 종류</h3>
              <TypeDropdown2
                onChange={(type) => {
                  handleTypeChange(type);
                }}
              />
            </div>
            <div id="search-buttons">
              <Button
                id="search-button"
                onClick={handleSearchClick}
                sx={{
                  width: "20vw",
                }}
              >
                검색
              </Button>
              <Button
                id="search-close-button"
                onClick={onClick}
                sx={{
                  width: "20vw",
                  backgroundColor: theme.palette.warning.main,
                }}
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;