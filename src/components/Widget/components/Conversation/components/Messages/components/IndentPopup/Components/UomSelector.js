import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "network";
import Select from "react-select";
import { changeUom } from "actions";
import { useTheme } from "@material-ui/core/styles";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const customStyles = {
    control: (provided, state) => {
        console.log("STATE OBJECT : ", state);
        return {
            ...provided,
            fontFamily: "Roboto",

            borderColor: state.isDisabled ? "grey" : "#696161"
        };
    },
    placeholder: (provided, state) => {
        console.log("STATE UOM ", state);
        return {
            ...provided,
            color: state.isDisabled ? "grey" : "#696161"
        };
    },

    dropdownIndicator: (provided, state) => ({
        ...provided,

        color: "#696161"
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        backgroundColor: "#696161"
    })
};

const UomSelector = props => {
    const [options, setOptions] = useState([]);
    const muiTheme = useTheme();
    const [disable, toggleDisable] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [selectInputValue, setSelectInputValue] = useState("");
    const item = useSelector(state => state.indents.item);
    const dispatch = useDispatch();
    const { clientCode, companyId, locationId, userId, apiHost } = useSelector(
        state => state.userData
    );

    useEffect(() => {
        const getUomData = async itemId => {
            dispatch(changeUom(null));
            // this.setState({ uomSelector: { disabled: false, loading: true, options: [] } });
            setSelectInputValue("");
            setOptions([]);
            setLoading(true);

            const response = await axios.post(`/api/Chatbot/GetInfo`, {
                basic_info: {
                    client_code: clientCode,
                    company_id: companyId,
                    location_id: locationId,
                    user_id: userId
                },
                info_type: "UOM_LIST",
                api_host: apiHost,
                raw_data: {
                    input_type_code: itemId // item_id
                }
            });

            // await this.sleep(2000)

            const items = response.data.data;
            const optionsNew = [];
            for (let i = 0; i < items.length; ++i) {
                optionsNew.push({
                    value: items[i].Code,
                    label: items[i].Value
                });
            }

            // this.setState({ uomSelector: { disabled: false, loading: false, options } });
            toggleDisable(false);
            setLoading(false);
            setOptions(optionsNew);
        };
        if (item) {
            getUomData(item.value);
        }
    }, [item]);

    const handleUomSelect = (item, action) => {
        setSelectInputValue({ label: item.label });
        dispatch(changeUom(item));
    };

    return (
        <Select
            isDisabled={disable}
            className="basic-single"
            classNamePrefix="select"
            isSearchable
            onChange={handleUomSelect}
            isLoading={isLoading}
            placeholder="UOM"
            name="color2"
            options={options}
            value={selectInputValue}
            styles={{
                menu: styles => ({ ...styles, zIndex: 2000 }),
                menuList: styles => ({
                    ...styles,
                    fontFamily: "Roboto"
                }),
                control: styles => ({
                    ...styles,
                    fontFamily: "Roboto"
                }),
                ...customStyles
            }}
            theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    neutral30: "black",
                    neutral20: "#696161",
                    neutral50: "grey",
                    primary: muiTheme.palette.primary.main
                }
            })}
        />
    );
};

export default UomSelector;
