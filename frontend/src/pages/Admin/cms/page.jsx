'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';

import './styles.css';

export default function CMSPage() {
    const [introduction, setIntroduction] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [news, setNews] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('introduction');
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('/api/content');
                const allContent = response.data;

                // Filter content by type
                setIntroduction(allContent.filter(item => item.contentType === 'Introduction'));
                setPromotions(allContent.filter(item => item.contentType === 'Promotions'));
                setNews(allContent.filter(item => item.contentType === 'News'));
                setAlerts(allContent.filter(item => item.contentType === 'Alerts'));
            } catch (error) {
                console.error('Error fetching content:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load content from the server.',
                });
            }
        };

        fetchContent();
    }, []);

    const handleAdd = () => {
        setEditingItem({
            title: '',
            description: '',
            image: '',
            isActive: true,
            contentType: '', // Content type is selected in the dialog
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleDelete = async (id, contentType) => {
        try {
            await axios.delete(`/api/content/${id}`);
            switch (contentType) {
                case 'Introduction':
                    setIntroduction(introduction.filter((item) => item._id !== id));
                    break;
                case 'Promotions':
                    setPromotions(promotions.filter((item) => item._id !== id));
                    break;
                case 'News':
                    setNews(news.filter((item) => item._id !== id));
                    break;
                case 'Alerts':
                    setAlerts(alerts.filter((item) => item._id !== id));
                    break;
                default:
                    break;
            }
            toast({
                title: 'Content Deleted',
                description: 'The content was successfully deleted.',
            });
        } catch (error) {
            console.error('Error deleting content:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete content.',
            });
        }
    };

    const handleSave = async (item) => {
        console.log(item);
        try {
            const response = item._id
                ? await axios.put(`/api/content/${item._id}`, item)
                : await axios.post('/api/content', item);

            const savedItem = response.data;

            switch (savedItem.contentType) {
                case 'Introduction':
                    setIntroduction((prev) =>
                        prev.some((i) => i._id === savedItem._id)
                            ? prev.map((i) => (i._id === savedItem._id ? savedItem : i))
                            : [...prev, savedItem]
                    );
                    break;
                case 'Promotions':
                    setPromotions((prev) =>
                        prev.some((i) => i._id === savedItem._id)
                            ? prev.map((i) => (i._id === savedItem._id ? savedItem : i))
                            : [...prev, savedItem]
                    );
                    break;
                case 'News':
                    setNews((prev) =>
                        prev.some((i) => i._id === savedItem._id)
                            ? prev.map((i) => (i._id === savedItem._id ? savedItem : i))
                            : [...prev, savedItem]
                    );
                    break;
                case 'Alerts':
                    setAlerts((prev) =>
                        prev.some((i) => i._id === savedItem._id)
                            ? prev.map((i) => (i._id === savedItem._id ? savedItem : i))
                            : [...prev, savedItem]
                    );
                    break;
                default:
                    break;
            }

            setEditingItem(null);
            toast({
                title: 'Content Saved',
                description: 'Your changes have been saved successfully.',
            });
        } catch (error) {
            console.error('Error saving content:', error);
            toast({
                title: 'Error',
                description: 'Failed to save changes.',
            });
        }
    };



    const renderTable = (items) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description/Content</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item._id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.description || item.content}</TableCell>
                        <TableCell>
                            {item.image && (
                                <div className="w-16 h-16 relative">
                                    <img src={item.image} alt={item.title} className="object-cover rounded" />
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="mr-2"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item._id, item.contentType)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="container">
            <h1 className="heading">Content Management System</h1>

            <Button className="btn add-button" onClick={handleAdd}>
                <Plus className="icon plus-icon" /> Add Content
            </Button>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="tabs-list">
                    <TabsTrigger value="introduction">Introduction</TabsTrigger>
                    <TabsTrigger value="promotions">Promotions</TabsTrigger>
                    <TabsTrigger value="news">News</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="introduction">{renderTable(introduction)}</TabsContent>
                <TabsContent value="promotions">{renderTable(promotions)}</TabsContent>
                <TabsContent value="news">{renderTable(news)}</TabsContent>
                <TabsContent value="alerts">{renderTable(alerts)}</TabsContent>
            </Tabs>

            <Dialog
                open={!!editingItem}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setEditingItem(null); // Clear editing item when dialog closes
                }}
            >
                <DialogContent className="dialog-content">
                    <DialogHeader className="dialog-header">
                        <DialogTitle className="dialog-title">
                            {editingItem?._id ? 'Edit' : 'Add'} Content
                        </DialogTitle>
                        <DialogDescription className="dialog-description">
                            {editingItem?._id
                                ? 'Edit the details of the content below.'
                                : 'Fill in the details for the new content.'}
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!editingItem.title || !editingItem.image || !editingItem.contentType) {
                                    return toast({
                                        title: 'Error',
                                        description: 'All fields, including Content Type, are required.',
                                    });
                                }
                                handleSave(editingItem);
                            }}
                            className="dialog-form"
                        >
                            {/* Content Type Selector */}
                            {!editingItem._id && (
                                <div className="form-group">
                                    <Label htmlFor="contentType" className="form-label">Content Type</Label>
                                    <select
                                        id="contentType"
                                        value={editingItem.contentType}
                                        onChange={(e) =>
                                            setEditingItem({ ...editingItem, contentType: e.target.value })
                                        }
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Content Type</option>
                                        <option value="Introduction">Introduction</option>
                                        <option value="Promotions">Promotions</option>
                                        <option value="News">News</option>
                                        <option value="Alerts">Alerts</option>
                                    </select>
                                </div>
                            )}

                            {/* Title Field */}
                            <div className="form-group">
                                <Label htmlFor="title" className="form-label">Title</Label>
                                <Input
                                    id="title"
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            {/* Description or Content Field */}
                            {/* Description Field */}
                            <div className="form-group">
                                <Label htmlFor="description" className="form-label">Description</Label>
                                <Textarea
                                    id="description"
                                    value={editingItem.description || ''}
                                    onChange={(e) =>
                                        setEditingItem({
                                            ...editingItem,
                                            description: e.target.value, // Always update the description field
                                        })
                                    }
                                    className="form-textarea"
                                />
                            </div>



                            {/* Image Field */}
                            <div className="form-group">
                                <Label htmlFor="image" className="form-label">Image URL</Label>
                                <Input
                                    id="image"
                                    value={editingItem.image || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <DialogFooter className="dialog-footer">
                                <Button type="submit" className="dialog-button">Save</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                    className="dialog-button-cancel"
                                >
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
