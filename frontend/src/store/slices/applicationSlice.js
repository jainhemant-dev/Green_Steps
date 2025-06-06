import { createSlice } from '@reduxjs/toolkit';

import { LOADING_TYPE } from '##/src/utility/utility.js';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    isApplicationLoading: true,
    isApplicationProcessing: false,
    loadingMessage: '',
    loadingType: LOADING_TYPE.APPLICATION,
    isToggleEnabled: true,
  },
  reducers: {
    setApplicationLoadingState: (state, action) => {
      state.isApplicationLoading = action.payload;
    },
    setToggleState: (state, action) => {
      state.isToggleEnabled = action.payload;
    },
    setApplicationProcessingState: (state, action) => {
      state.isApplicationProcessing = !!action.payload;

      if (state.isApplicationProcessing) {
        state.loadingMessage =
          typeof action.payload === 'string' ? action.payload : '';
        state.loadingType = LOADING_TYPE.PROCESSING;
      }
    },
  },
});

const {
  setApplicationLoadingState,
  setToggleState,
  setApplicationProcessingState,
} = applicationSlice.actions;

const selectApplicationLoadingState = (state) =>
  state.application.isApplicationLoading;
const selectIsApplicationLoading = (state) =>
  state.application.isApplicationProcessing ||
  state.application.isApplicationLoading;
const selectIsApplicationProcessing = (state) =>
  state.application.isApplicationProcessing;
const selectLoadingMessage = (state) => state.application.loadingMessage;
const selectLoadingType = (state) => state.application.loadingType;
const selectToggleState = (state) => state.application.isToggleEnabled;

export {
  setApplicationLoadingState,
  setApplicationProcessingState,
  selectApplicationLoadingState,
  selectIsApplicationProcessing,
  selectIsApplicationLoading,
  selectLoadingMessage,
  selectLoadingType,
  selectToggleState,
  setToggleState,
};

export default applicationSlice.reducer;
