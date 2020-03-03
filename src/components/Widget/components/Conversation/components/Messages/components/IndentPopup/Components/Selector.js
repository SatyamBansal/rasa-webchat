import React from "react";
import Select from "react-select";
import axios from "axios";
import _ from "lodash";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Link from "@material-ui/core/Link";

import { connect } from "react-redux";
import { addItem } from "actions";

const colourOptions = [
    { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630", isFixed: true },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" }
];

const formatOptionLabel = ({ value, label, isParent }) => (
    <div style={{ display: "flex" }}>
        <div>{label}</div>
        <div
            style={{
                marginRight: "5px",
                color: "#ccc",
                visibility: isParent ? "visible" : "hidden"
            }}
        >
            <ArrowDropDownIcon />
        </div>
    </div>
);

class Selector extends React.Component {
    selectRef = null;
    state = {
        path: [{ name: "root", id: 0 }],
        loading: true,
        selectOptions: [],
        isMenuOpen: undefined,
        selectInputValue: ""
    };

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    getData = async itemID => {
        const user = this.props.user;
        console.log("Gettting Item List for user : ", user);
        const response = await axios.post("http://bluekaktus.ml/proxy/GetItemList", {
            basic_Info: {
                client_code: user.clientCode,
                company_Id: user.companyId,
                location_Id: user.locationId,
                user_Id: user.userId
            },
            raw_data: {
                item_id: itemID
            }
        });

        console.log("Response from Item list api", response);
        // await this.sleep(2000)

        const items = response.data.data;
        const options = [];
        for (let i = 0; i < items.length; ++i) {
            options.push({
                value: items[i].ITEM_ID,
                label: items[i].ITEM_NAME.toLowerCase(),
                quantity: items[i].QUANTITY,
                rate: items[i].RATE,
                isParent: items[i].ITEM_TYPE === "S"
            });
        }

        this.setState({ selectOptions: options, loading: false });
    };
    componentDidMount() {
        this.getData(0);
        console.log("REf element ", this.selectRef);
    }

    handlePathClick = event => {
        event.preventDefault();

        const pathItemClicked = event.target.innerText;
        const currentPath = this.state.path;

        const newPath = _.dropRightWhile(currentPath, obj => obj.name != pathItemClicked);
        this.props.dispatch(addItem(null));
        this.setState(
            {
                path: newPath,
                loading: true,
                selectOptions: [],
                selectInputValue: "",
                isMenuOpen: true
            },
            () => {
                this.setState({ isMenuOpen: undefined });
            }
        );
        // setTimeout(() => {
        //     this.setState({ isMenuOpen: undefined })
        // }, 100)
        // this.selectRef.blur()
        for (let i = 0; i < newPath.length; ++i) {
            if (newPath[i].name == pathItemClicked) {
                this.getData(newPath[i].id);
                break;
            }
        }
    };

    getMenu = pathCurrent => {
        console.log("generating new menu ...........", pathCurrent);
        console.log("Current State ... ", this.state);
        const path = pathCurrent;
        const menu = [];
        for (let i = 0; i < path.length; ++i) {
            const menuColour = i != path.length - 1 ? "inherit" : "primary";

            menu.push(
                <Link color={menuColour} onClick={this.handlePathClick}>
                    {path[i].name}
                </Link>
            );
        }

        return menu;
    };

    handleButtonClick = () => {
        this.setState({
            isLoading: true
        });
        this.getData();
        console.log("Changing Loading State", this.state.loading);
        setTimeout(() => {
            this.setState(prevState => {
                let options = [];
                if (prevState.loading) {
                    options = colourOptions;
                }
                console.log(prevState);
                return {
                    loading: !prevState.loading,
                    selectOptions: options
                };
            });
        }, 2000);
    };

    handleFocus = event => {
        console.log("In focus", event);
        // this.setState({ isMenuOpen: true })
    };
    onChange = (item, action) => {
        // console.log(args)
        console.log("IN on change ............");
        console.log(item);
        if (item.isParent) {
            this.setState(prevState => {
                console.log("Inside element clicked, prevState : ", prevState);
                return {
                    loading: true,
                    selectOptions: [],
                    path: _.concat(prevState.path, {
                        name: item.label,
                        id: item.value,
                        selectInputValue: ""
                    })
                };
            });
            this.getData(item.value);
        } else {
            console.log("ITEM SELECTED : ", item);
            this.props.dispatch(addItem(item));
            this.setState(
                {
                    isMenuOpen: false,
                    selectInputValue: { label: item.label }
                },
                () => {
                    this.selectRef.blur();
                    this.setState({ isMenuOpen: undefined });
                }
            );
            // setTimeout(() => {
            //     this.setState({ isMenuOpen: undefined })
            // }, 10)
            // // this.selectRef.blur()
        }
    };

    handleInputChange = (first, second) => {
        // this.setState({ selectInputValue: '' })

        console.log("INput changed Called ", { first, second });
    };
    handleClick = event => {
        console.log("I am clicked with event : ", event);
    };
    render() {
        console.log(this.props);
        return (
            <div>
                <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                    {this.getMenu(this.state.path)}
                </Breadcrumbs>
                {/* <div>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="inherit"
                            href="/"
                            onClick={this.handlePathClick}
                        >
                            Material-UI
                        </Link>
                        <Link
                            color="inherit"
                            href="/getting-started/installation/"
                            onClick={this.handlePathClick}
                        >
                            Core
                        </Link>
                        <Link
                            href="/getting-started/installation/"
                            onClick={this.handlePathClick}
                        >
                            Core
                        </Link>
                    </Breadcrumbs>
                </div> */}
                <div onClick={this.handleClick()}>
                    <Select
                        isDisabled={this.props.isDisabled}
                        ref={ref => {
                            this.selectRef = ref;
                        }}
                        value={this.state.selectInputValue}
                        // value={{ label: this.state.selectInputValue }}
                        // inputValue={this.state.selectInputValue}
                        placeholder="Select any option"
                        menuIsOpen={this.state.isMenuOpen}
                        isLoading={this.state.loading}
                        options={this.state.selectOptions}
                        closeMenuOnSelect={false}
                        // formatOptionLabel={formatOptionLabel}
                        onChange={this.onChange}
                        styles={{
                            menu: styles => ({ ...styles, zIndex: 2000 }),
                            menuList: styles => ({
                                ...styles,
                                fontFamily: "Roboto"
                            }),
                            control: styles => ({
                                ...styles,
                                fontFamily: "Roboto"
                            })
                        }}
                        openMenuOnClick
                        // onInputChange={this.handleInputChange}
                        onFocus={this.handleFocus}
                    />
                </div>

                {/* <button
                    onClick={() => {
                        this.handleButtonClick()
                    }}
                    style={{ marginTop: '400px' }}
                >
                    Change state
                </button> */}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userData
});

export default connect(mapStateToProps)(Selector);
