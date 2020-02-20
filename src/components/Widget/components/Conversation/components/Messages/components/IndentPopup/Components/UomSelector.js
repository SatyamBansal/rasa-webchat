import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { changeUom } from "actions";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const UomSelector = props => {
    const [options, setOptions] = useState([]);
    const [disable, toggleDisable] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [selectInputValue, setSelectInputValue] = useState("");
    const item = useSelector(state => state.indents.item);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUomData = async itemId => {
            dispatch(changeUom(null));
            // this.setState({ uomSelector: { disabled: false, loading: true, options: [] } });
            setSelectInputValue("");
            setOptions([]);
            setLoading(true);
            await sleep(2000);
            const response = await axios.post("http://192.168.1.33:81/api/Chatbot/GetInfo", {
                basic_info: {
                    client_code: "akri48",
                    company_id: 4,
                    location_id: 6,
                    user_id: 1
                },
                info_type: "UOM_LIST",
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
                })
            }}
        />
    );
};

export default UomSelector;
