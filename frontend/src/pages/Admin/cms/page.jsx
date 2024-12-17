'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ImageIcon, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import cmsStyle from './stylesCMS.module.css';
import Config from '~/Config';

export default function CMSPage() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [introduction, setIntroduction] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [news, setNews] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('introduction');
    const [editingItem, setEditingItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);


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
            image: '',
            isActive: true,
            contentType: '',
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
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
        try {
            if (editingItem._id) {
                await axios.put(`${apiBaseUrl}/api/content/${editingItem._id}`, editingItem);
            } else {
                await axios.post(`${apiBaseUrl}/api/content`, editingItem);
            }
            fetchContent();
            setEditingItem(null);
            setIsDialogOpen(false);
            showToast('Content Saved', 'Your changes have been saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving content:', error);
            showToast('Error', 'Failed to save changes.', 'error');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        if (file) {
            setEditingItem((prevItem) => ({
                ...prevItem,
                image: file.name,
            }));
        }
    };

    const renderTable = (items) => (
        <table className={cmsStyle.cms_table}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>
                            {item.image && (
                                <img
                                    src={`../../../assets/uploads/${item.image}`}
                                    alt={item.title}
                                    className={cmsStyle.table_image}
                                />
                            )}
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
                    <button
                        className={`${cmsStyle.tab_button} ${activeTab === 'introduction' ? cmsStyle.active : ''}`}
                        onClick={() => setActiveTab('introduction')}
                    >
                        Introduction
                    </button>
                    <button
                        className={`${cmsStyle.tab_button} ${activeTab === 'promotions' ? cmsStyle.active : ''}`}
                        onClick={() => setActiveTab('promotions')}
                    >
                        Promotions
                    </button>
                    <button
                        className={`${cmsStyle.tab_button} ${activeTab === 'news' ? cmsStyle.active : ''}`}
                        onClick={() => setActiveTab('news')}
                    >
                        News
                    </button>
                    <button
                        className={`${cmsStyle.tab_button} ${activeTab === 'alerts' ? cmsStyle.active : ''}`}
                        onClick={() => setActiveTab('alerts')}
                    >
                        Alerts
                    </button>
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
                <div className={cmsStyle.modal_overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsDialogOpen(false);
                }}>
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
                                <label htmlFor="image">Upload Image</label>
                                <div className={cmsStyle.file_input_wrapper}>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="image" className={cmsStyle.file_input_label}>
                                        {/* <ImageIcon size={18} /> */}
                                        {/* {editingItem.image ? editingItem.image : 'Choose a file'} */}
                                        {editingItem.image ? (
                                            <img src={`../../../assets/uploads/${editingItem.image}`} alt="Preview" className={cmsStyle.image_preview} />
                                        ) : (
                                            'Choose a file'
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className={cmsStyle.form_actions}>
                                <button type="submit" className={cmsStyle.save_button}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className={cmsStyle.cancel_button}
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
                    className={`${cmsStyle.toast} ${toastMessage.type === 'success'
                        ? cmsStyle.success
                        : cmsStyle.error
                        }`}
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
