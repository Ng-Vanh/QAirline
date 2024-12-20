'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import cmsStyle from './stylesCMS.module.css';
import Config from '~/Config';

export default function CMSPage() {
    const apiBaseUrl = Config.apiBaseUrl;

    // State for content
    const [introduction, setIntroduction] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [news, setNews] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // State for UI interactions
    const [activeTab, setActiveTab] = useState('introduction');
    const [editingItem, setEditingItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);

    // Loading for save operation
    const [isSaving, setIsSaving] = useState(false);

    // Temporary image file for preview
    const [tempImageFile, setTempImageFile] = useState(null);

    // Fetch content from backend
    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/api/content`);
            const allContent = response.data;

            setIntroduction(allContent.filter(item => item.contentType === 'Introduction'));
            setPromotions(allContent.filter(item => item.contentType === 'Promotions'));
            setNews(allContent.filter(item => item.contentType === 'News'));
            setAlerts(allContent.filter(item => item.contentType === 'Alerts'));
        } catch (error) {
            console.error('Error fetching content:', error);
            showToast('Error', 'Failed to load content from the server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setToastOpen(true);
    };

    const handleAdd = () => {
        setEditingItem({
            title: '',
            description: '',
            image: '', // No image initially
            isActive: true,
            contentType: '',
        });
        setTempImageFile(null); // Clear temporary file
        setIsDialogOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem({ ...item }); // Set existing content for editing
        setTempImageFile(null); // Clear temporary file
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/api/content/${id}`);
            fetchContent();
            showToast('Content Deleted', 'The content was successfully deleted.', 'success');
        } catch (error) {
            console.error('Error deleting content:', error);
            showToast('Error', 'Failed to delete content.', 'error');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true); // Start the saving process

        try {
            if (!editingItem.title || !editingItem.description || !editingItem.contentType) {
                showToast('Validation Error', 'Title, description, and content type are required.', 'error');
                setIsSaving(false);
                return;
            }

            let uploadedImageFilename = editingItem.image;

            // Upload the new image if selected
            if (tempImageFile) {
                const formData = new FormData();
                formData.append('image', tempImageFile);

                const uploadResponse = await axios.post(`${apiBaseUrl}/api/files/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                uploadedImageFilename = uploadResponse.data.file.filename;
            }

            // Prepare content data
            const contentData = {
                ...editingItem,
                image: uploadedImageFilename,
            };

            if (editingItem._id) {
                await axios.put(`${apiBaseUrl}/api/content/${editingItem._id}`, contentData);
            } else {
                await axios.post(`${apiBaseUrl}/api/content`, contentData);
            }

            fetchContent();
            setEditingItem(null);
            setIsDialogOpen(false);
            showToast('Content Saved', 'Your changes have been saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving content:', error);
            showToast('Error', 'Failed to save changes.', 'error');
        } finally {
            setIsSaving(false); // End the saving process
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImageFile(file);
            setEditingItem((prev) => ({
                ...prev,
                image: URL.createObjectURL(file), // Use URL for instant preview
            }));
        }
    };
    const handleToggleActive = async (item) => {
        try {
            const updatedItem = { ...item, isActive: !item.isActive };

            // Gửi request cập nhật trạng thái
            await axios.put(`${apiBaseUrl}/api/content/${item._id}`, updatedItem);

            // Cập nhật trực tiếp vào state tương ứng
            switch (item.contentType) {
                case 'Introduction':
                    setIntroduction((prev) =>
                        prev.map((el) => (el._id === item._id ? updatedItem : el))
                    );
                    break;
                case 'Promotions':
                    setPromotions((prev) =>
                        prev.map((el) => (el._id === item._id ? updatedItem : el))
                    );
                    break;
                case 'News':
                    setNews((prev) =>
                        prev.map((el) => (el._id === item._id ? updatedItem : el))
                    );
                    break;
                case 'Alerts':
                    setAlerts((prev) =>
                        prev.map((el) => (el._id === item._id ? updatedItem : el))
                    );
                    break;
                default:
                    break;
            }

            showToast('Status Updated', 'The content status has been updated.', 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Error', 'Failed to update status.', 'error');
        }
    };


    const renderTable = (items) => (
        <table className={cmsStyle.cms_table}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item._id}>
                        <td>{item.title}</td>
                        <td className={cmsStyle.table_description}>{item.description}</td>
                        <td>
                            {item.image && (
                                <img
                                    src={`${apiBaseUrl}/api/files/image/${item.image}`}
                                    alt={item.title}
                                    className={cmsStyle.table_image}
                                />
                            )}
                        </td>
                        <td>
                            <label className={cmsStyle.toggle_switch}>
                                <input
                                    type="checkbox"
                                    checked={item.isActive}
                                    onChange={() => handleToggleActive(item)}
                                />
                                <span className={cmsStyle.slider}></span>
                            </label>
                        </td>
                        <td>
                            <button
                                onClick={() => handleEdit(item)}
                                className={`${cmsStyle.action_button} ${cmsStyle.edit_button}`}
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className={`${cmsStyle.action_button} ${cmsStyle.delete_button}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className={cmsStyle.cms_container}>
            <h1 className={cmsStyle.cms_heading}>Content Management System</h1>

            <button className={cmsStyle.add_button} onClick={handleAdd}>
                <Plus size={18} /> Add Content
            </button>

            <div className={cmsStyle.tabs}>
                <div className={cmsStyle.tab_list}>
                    {['introduction', 'promotions', 'news', 'alerts'].map((tab) => (
                        <button
                            key={tab}
                            className={`${cmsStyle.tab_button} ${activeTab === tab ? cmsStyle.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={cmsStyle.tab_content}>
                    {loading ? (
                        <div className={cmsStyle.loading}>
                            <Loader className={cmsStyle.spinner} />
                            <p>Loading content...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'introduction' && renderTable(introduction)}
                            {activeTab === 'promotions' && renderTable(promotions)}
                            {activeTab === 'news' && renderTable(news)}
                            {activeTab === 'alerts' && renderTable(alerts)}
                        </>
                    )}
                </div>
            </div>

            {isDialogOpen && (
                <div
                    className={cmsStyle.modal_overlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsDialogOpen(false);
                    }}
                >
                    <div className={cmsStyle.modal}>
                        <h2>{editingItem?._id ? 'Edit Content' : 'Add Content'}</h2>
                        <form onSubmit={handleSave}>
                            <div className={cmsStyle.form_group}>
                                <label htmlFor="contentType">Content Type</label>
                                <select
                                    id="contentType"
                                    value={editingItem.contentType}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, contentType: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Introduction">Introduction</option>
                                    <option value="Promotions">Promotions</option>
                                    <option value="News">News</option>
                                    <option value="Alerts">Alerts</option>
                                </select>
                            </div>
                            <div className={cmsStyle.form_group}>
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    value={editingItem.title}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, title: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className={cmsStyle.form_group}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={editingItem.description}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, description: e.target.value })
                                    }
                                />
                            </div>
                            <div className={cmsStyle.form_group}>
                                <span>Upload Image</span>
                                <div className={cmsStyle.file_input_wrapper}>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {editingItem.image && (
                                        <img
                                            src={
                                                tempImageFile
                                                    ? editingItem.image // Temporary uploaded file
                                                    : `${apiBaseUrl}/api/files/image/${editingItem.image}` // Fetched URL
                                            }
                                            alt="Preview"
                                            className={cmsStyle.image_preview}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={cmsStyle.form_actions}>
                                {/* <Loader className={cmsStyle.spinner} />  */}
                                <button
                                    type="submit"
                                    className={cmsStyle.save_button}
                                    disabled={isSaving}
                                >

                                    {isSaving ? (
                                        <div className={cmsStyle.save_button_container}>
                                            Processing
                                            <Loader className={`${cmsStyle.spinner} ${cmsStyle.spinner_save}`} />
                                        </div>
                                    ) : 'Save'}

                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className={cmsStyle.cancel_button}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Toast.Provider>
                <Toast.Root
                    className={`${cmsStyle.toast} ${toastMessage.type === 'success' ? cmsStyle.success : cmsStyle.error}`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                >
                    <Toast.Title className={cmsStyle.toastTitle}>
                        {toastMessage.title}
                    </Toast.Title>
                    <Toast.Description className={cmsStyle.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={cmsStyle.toastViewport} />
            </Toast.Provider>
        </div>
    );
}
