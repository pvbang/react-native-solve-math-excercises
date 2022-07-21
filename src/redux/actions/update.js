import { UPDATE_GRADE } from "../reducers/infoReducer"

export const updateGrade = (grade) => async dispatch => {
    try {
        dispatch ({
            type: UPDATE_GRADE,
            grade: grade
        })
    } catch (error) {

    }
}