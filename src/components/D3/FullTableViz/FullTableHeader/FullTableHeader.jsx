import React, { useState, useEffect, useMemo } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { Search } from '@styled-icons/material-outlined';

import './FullTableHeader.scss';
import { dataFieldsByColumn } from '../../../../utils/constants';
export const FullTableHeader = ({
  data,
  tableData,
  setTableData,
  sortingValueSelected,
  setSortingValueSelected,
  searchInput,
  setSearchInput,
  setCurrentPage,
}) => {
  const [dropdownValueSelected, setDropdownValueSelected] = useState('all');
  const quickSortOptions = [
    { label: 'Default', value: 'none' },
    { label: 'Z-Score', value: dataFieldsByColumn['zscore'] },
    { label: 'Index', value: dataFieldsByColumn['index'] },
    // { label: 'Client Percent', value: dataFieldsByColumn['clientPercentage'] },
  ];

  function getDataBySelectedCategory(selectedCategory, dataInput) {
    if (selectedCategory !== 'all') {
      return dataInput.filter(
        (d) => d[dataFieldsByColumn.category] === selectedCategory
      );
    }
    return dataInput;
  }

  const getDataFilteredBySearchInput = (dataInput) => {
    let filteredData = dataInput;
    if (searchInput) {
      filteredData = dataInput.filter(
        (d) =>
          d[dataFieldsByColumn.element]
            .toUpperCase()
            .indexOf(searchInput.toUpperCase()) > -1 ||
          d[dataFieldsByColumn.elementCode]
            .toUpperCase()
            .indexOf(searchInput.toUpperCase()) > -1
      );
    }
    return filteredData;
  };

  const getDropdownOptions = (fullData) => {
    const uniqueCategories = [
      ...new Set(fullData.map((item) => item['dpa_main.product_name'])),
    ];
    const options = [];

    options.push({ label: 'All', value: 'all' });
    uniqueCategories
      .sort()
      .map((item) => options.push({ label: item, value: item }));
    return options;
  };

  const onDropdownChange = (e) => {
    setDropdownValueSelected(e);
    if (e === 'all') setTableData(data);
    else if (searchInput) {
      const filteredData = getDataFilteredBySearchInput(
        getDataBySelectedCategory(e, data)
      );
      setTableData(filteredData);
    } else {
      const filteredData = getDataBySelectedCategory(e, data);
      setTableData(filteredData);
    }
    setCurrentPage(0);
  };

  // Use memo to prevent filtering data by category every time the input changes
  const dataBySelectedCategory = useMemo(
    () => getDataBySelectedCategory(dropdownValueSelected, data),
    [dropdownValueSelected, data]
  );

  // Reset header items when data changes
  useEffect(() => {
    setDropdownValueSelected('all');
    setSortingValueSelected('none');
    setSearchInput('');
    setTableData(data);
  }, [data]);

  useEffect(() => {
    let sortedData = [];
    if (sortingValueSelected === 'none') {
      sortedData = tableData.sort((a, b) => {
        if (a[dataFieldsByColumn.category] === b[dataFieldsByColumn.category]) {
          if (
            a[dataFieldsByColumn.elementCode] ===
            b[dataFieldsByColumn.elementCode]
          ) {
            return a['dpa_main.value'].localeCompare(
              b['dpa_main.value'],
              'en',
              {
                numeric: true,
              }
            );
          }
          return a[dataFieldsByColumn.elementCode] <
            b[dataFieldsByColumn.elementCode]
            ? -1
            : 1;
        }
        return a[dataFieldsByColumn.category] < b[dataFieldsByColumn.category]
          ? -1
          : 1;
      });
    } else {
      sortedData = tableData.sort(
        (a, b) => b[sortingValueSelected] - a[sortingValueSelected]
      );
    }
    setTableData(sortedData);
  }, [sortingValueSelected, dropdownValueSelected]);

  // search by marketing name and element
  useEffect(() => {
    const dataFilteredBySearchInput = getDataFilteredBySearchInput(
      dataBySelectedCategory
    );
    setTableData(dataFilteredBySearchInput);
  }, [searchInput]);

  return (
    <div className="table-header-container">
      <div className="table-header-item-container right">
        <InputLabel className="input-label">Categories</InputLabel>

        <Select
          defaultValue="all"
          value={dropdownValueSelected}
          color="primary"
          autoWidth
          onChange={(e) => {
            onDropdownChange(e.target.value);
          }}
        >
          {getDropdownOptions(data).map((item) => (
            <MenuItem value={item.value} key={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="table-header-item-container right">
        <InputLabel className="input-label">Search Element</InputLabel>
        <TextField
          className="search-input"
          color="primary"
          value={searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="search-icon" />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      <div className="table-header-item-container left">
        <InputLabel className="input-label">Sort Order</InputLabel>

        <Select
          defaultValue={quickSortOptions[0]}
          value={sortingValueSelected}
          color="primary"
          autoWidth
          onChange={(e) => {
            setSortingValueSelected(e.target.value);
            setCurrentPage(0);
          }}
        >
          {quickSortOptions.map((item) => (
            <MenuItem value={item.value} key={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};
