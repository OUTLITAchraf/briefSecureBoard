// ProfileEditForm.js

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './EditForm.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../../features/AuthSlice';
import { toast } from 'react-toastify'; 

const schema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    email: yup.string().email('Must be a valid email.').required('Email is required.'),
});

const EditForm = ({ user }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        values: {
            name: user?.name,
            email: user?.email
        }
    });

    const { update } = useSelector((state) => state.auth);

    const onSubmit = (data) => {
        dispatch(updateProfile(data))
            .unwrap()
            .then(() => toast.success("Profile updated successfully 🎉"))
            .catch((err) => toast.error(err || "Failed to update profile ❌"));
    };

    return (
        <div className="profile-edit-container">
            <div className="profile-header">
                <h2>Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" className="form-control" {...register('name')} />
                    {errors.name && <p className="error-message">{errors.name.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" className="form-control" {...register('email')} />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={!isDirty || update.isLoading}
                    style={{ cursor: (!isDirty || update.isLoading) ? 'not-allowed' : 'pointer' }}
                >
                    {update.isLoading ? <><span className="spinner"></span>Saving...</> : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditForm;
