import React from "react";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import { NeumorphicContainer } from "../../styles/StyledComponents";

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const ToggleSlider = styled(NeumorphicContainer)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 34px;
  transition: 0.4s;
  cursor: pointer;
  padding: 0;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${(props) => (props.checked ? "27px" : "3px")};
    bottom: 3px;
    background-color: ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    transition: 0.4s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
  }

  .moon {
    right: 7px;
    color: ${(props) => props.theme.colors.text};
    opacity: ${(props) => (props.checked ? "1" : "0.3")};
  }

  .sun {
    left: 7px;
    color: ${(props) => props.theme.colors.text};
    opacity: ${(props) => (!props.checked ? "1" : "0.3")};
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer>
      <ToggleSwitch>
        <ToggleInput
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <ToggleSlider checked={isDarkMode}>
          <span className="icon sun">
            <i className="fas fa-sun"></i>
          </span>
          <span className="icon moon">
            <i className="fas fa-moon"></i>
          </span>
        </ToggleSlider>
      </ToggleSwitch>
    </ToggleContainer>
  );
};

export default ThemeToggle;
