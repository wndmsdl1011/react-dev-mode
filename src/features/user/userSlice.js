// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import willService from "../../services/willService";
import { showToastMessage } from "../common/uiSlice";

// 로그인
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await willService.loginUser({ username, password });
      const { user } = response.data;
      const { id: userId, username: userNameFromServer, name: realName, role:role} = user;
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("realName", realName);
      sessionStorage.setItem("role", role);


      dispatch(
        showToastMessage({
          message: `환영합니다, ${realName}님!`,
          status: "success",
        })
      );

      return { username: userNameFromServer, userId, realName };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "로그인에 실패했습니다.";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// 일반 회원가입
// userSlice.js (또는 해당 Thunk가 정의된 파일)
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { dispatch, rejectWithValue }) => {
    // userData는 { values: formWithoutAddress, navigate: navigateFunc }

    try {
      // userData.values가 실제 form 데이터 객체입니다.
      // 여기에 address와 role을 추가합니다.
      const payloadToBackend = {
        ...userData.values, // 기존 form 데이터 (email, password, name, phone, birth, gender 등)
        address: userData.values.address || "임시 주소", // form에 address가 없다면 임시값 사용
                                                       // 또는 백엔드에서 null을 허용한다면 null
        role: "USER", // 역할 명시적으로 USER로 설정
        // companyName과 registrationNumber는 USER에게는 불필요할 수 있으므로,
        // 백엔드에서 이 필드들을 어떻게 처리하는지에 따라 추가 여부 결정
        // (예: companyName: userData.values.companyName || null)
      };

      console.log("백엔드로 전달될 데이터:", payloadToBackend);

      // 가공된 payloadToBackend 객체를 서비스 함수로 전달
      const response = await willService.registerUser(payloadToBackend);

      if (userData.navigate) {
        userData.navigate("/login"); // 예시: 로그인 페이지로 이동
      }

      dispatch(
        showToastMessage({
          message: "회원가입이 완료되었습니다. 로그인해주세요!",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      console.error("회원가입 에러:", error.response?.data || error.message); // 에러 로깅 강화
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// 공증인 회원가입
export const registerNotary = createAsyncThunk(
  "user/registerNotary",
  async ({ values, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await willService.registerNotary(values);

      dispatch(
        showToastMessage({
          message: "공증인 회원가입이 완료되었습니다. 로그인해주세요!",
          status: "success",
        })
      );

      navigate("/login");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "공증인 회원가입에 실패했습니다.";

      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);

// 로그아웃
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("realName");
    dispatch(
      showToastMessage({
        message: "성공적으로 로그아웃되었습니다.",
        status: "success",
      })
    );
  }
);

// 초기 상태
const initialState = {
  username: sessionStorage.getItem("username") || null,
  userId: sessionStorage.getItem("userId") || null,
  realName: sessionStorage.getItem("realName") || null,
  loading: false,
  error: null,
};

// 슬라이스
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.userId = action.payload.userId;
        state.realName = action.payload.realName;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 회원가입
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 공증인 회원가입
      .addCase(registerNotary.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerNotary.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerNotary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 로그아웃
      .addCase(logoutUser.fulfilled, (state) => {
        state.username = null;
        state.userId = null;
        state.realName = null;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
