import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'


// 1. Thunks for each api calls 

export const startChatSession = createAsyncThunk(
    'support/start',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post('support/session/', { email })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data) || "An error occurred in starting the chat session"
        }
    }

)
// GUNJAN LAUDI 🦥 github.com/anantacoder

export const getChatHistory = createAsyncThunk(
    'support/history',
    async ({ sessionId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`support/history/${sessionId}/`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data) || "AN error occurred in retrieving the chat history"
        }
    }
)


export const sendMessage = createAsyncThunk(
    'support/sendMessage',
    async ({ sessionId, message }, { rejectWithValue }) => {
        try {
            const payload = {
                session_id: sessionId,
                message: message,
                sender: "user"
            }
            const response = await api.post('support/send/', payload)
            return response.data //creating the message obj 
        } catch (error) {
            return rejectWithValue(error.response?.data) || "An error occurred in sending the message "
        }
    }
)


export const connectWebSocket = createAsyncThunk(
    'support/connectWebSocket',
    async ({ sessionId }, { dispatch, rejectWithValue }) => {
        try {
            const socket = new WebSocket(`ws://localhost:8000/ws/support/${sessionId}/`)
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                dispatch(addMessage({ sender: data.sender, message: data.message }));
            }
        } catch (error) {
            return rejectWithValue(error.response?.data) || "An error occurred in connecting to the websocket "

        }
    }
)


// 2. initial slice creation 

const initialState = {
    session: null,
    messages: [],
    loading: false,
    error: null
}

// 3. crate the main slice 

const supportSlice = createSlice({
    name: "support",
    initialState: initialState,
    reducers: {
        addMessage: (state, action) => {
            const incoming = action.payload;
            if (!incoming) return;
            const exists = state.messages.some(
                (m) => (incoming.id && m.id === incoming.id) ||
                       (m.sender === incoming.sender && m.message === incoming.message)
            );
            if (!exists) {
                state.messages.push(incoming);
            }
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // start chat session cases 
            .addCase(startChatSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startChatSession.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.session = payload;
            })
            .addCase(startChatSession.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // GET CHAT HISTORY
            .addCase(getChatHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChatHistory.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.messages = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload.messages)
                        ? payload.messages
                        : [];
            })
            .addCase(getChatHistory.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // SEND MESSAGE
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, { payload }) => {
                state.loading = false;
                const userMsg = {
                    id: payload.id,
                    sender: payload.sender,
                    message: payload.message,
                    timestamp: payload.timestamp
                };
                if (!state.messages.some(m => m.id === userMsg.id || (m.sender === userMsg.sender && m.message === userMsg.message))) {
                    state.messages.push(userMsg);
                }
                if (payload.bot_message) {
                    if (!state.messages.some(m => m.id === payload.bot_message.id)) {
                        state.messages.push(payload.bot_message);
                    }
                }
            })
            .addCase(sendMessage.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }

})


// 4. exporting the actions and reducers 

export const { addMessage, clearMessages } = supportSlice.actions;
export default supportSlice.reducer
