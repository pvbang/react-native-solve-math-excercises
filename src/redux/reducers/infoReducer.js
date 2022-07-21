export const UPDATE_GRADE = "UPDATE_GRADE"

const initialState = {
    grade: "",
}

export default function actionForReducer(state = initialState, payLoad) {
    switch (payLoad.type) {
        case UPDATE_GRADE:
            return {
                ...state,
                grade: payLoad.grade
            }
        default:
            return state
    }
}