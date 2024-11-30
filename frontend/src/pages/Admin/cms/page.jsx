'use client';

import { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Plus, Edit, Trash2, ImageIcon } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';

import './styles.css'
const initialPromotions = [
    { id: 1, title: "Summer Sale", description: "Get up to 20% off on select flights", link: "/promotions/summer-sale", image: "/placeholder.svg?height=200&width=300" },
    { id: 2, title: "Business Class Upgrade", description: "Upgrade to Business Class for just $200", link: "/promotions/business-upgrade", image: "/placeholder.svg?height=200&width=300" },
];

const initialNews = [
    { id: 1, title: "New Route to Paris", content: "We're excited to announce our new direct route to Paris starting next month!", date: "2023-06-01", image: "/placeholder.svg?height=150&width=250" },
    { id: 2, title: "QAirline Wins Best Airline Award", content: "QAirline has been voted the Best Airline of 2023 by Skytrax", date: "2023-05-15", image: "/placeholder.svg?height=150&width=250" },
];

const initialDestinations = [
    { id: 1, title: "Paris", image: "/placeholder.svg?height=300&width=400" },
    { id: 2, title: "Tokyo", image: "/placeholder.svg?height=300&width=400" },
    { id: 3, title: "New York", image: "/placeholder.svg?height=300&width=400" },
    { id: 4, title: "Sydney", image: "/placeholder.svg?height=300&width=400" },
];

const initialAlerts = [
    { id: 1, title: "COVID-19 Travel Updates", description: "Check the latest travel restrictions and requirements before your flight", link: "/covid-19-updates" },
    { id: 2, title: "Airport Construction Notice", description: "Ongoing construction at Terminal 2 may cause slight delays. Please arrive early.", link: "/airport-updates" },
];
export default function CMSPage() {
    const [promotions, setPromotions] = useState(initialPromotions);
    const [news, setNews] = useState(initialNews);
    const [destinations, setDestinations] = useState(initialDestinations);
    const [alerts, setAlerts] = useState(initialAlerts);
    const [activeTab, setActiveTab] = useState('promotions');
    const [editingItem, setEditingItem] = useState(null);

    const handleAdd = (type) => {
        const newItem = {
            id: Date.now(),
            title: '',
            description: '',
            content: '',
            link: '',
            date: '',
            image: '',
        };
        switch (type) {
            case 'promotions':
                setPromotions([...promotions, newItem]);
                break;
            case 'news':
                setNews([...news, newItem]);
                break;
            case 'destinations':
                setDestinations([...destinations, newItem]);
                break;
            case 'alerts':
                setAlerts([...alerts, newItem]);
                break;
            default:
                break;
        }
        setEditingItem(newItem);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleDelete = (type, id) => {
        switch (type) {
            case 'promotions':
                setPromotions(promotions.filter((item) => item.id !== id));
                break;
            case 'news':
                setNews(news.filter((item) => item.id !== id));
                break;
            case 'destinations':
                setDestinations(destinations.filter((item) => item.id !== id));
                break;
            case 'alerts':
                setAlerts(alerts.filter((item) => item.id !== id));
                break;
            default:
                break;
        }
        toast({
            title: 'Item Deleted',
            description: 'The item has been successfully deleted.',
        });
    };

    const handleSave = (type, item) => {
        switch (type) {
            case 'promotions':
                setPromotions(promotions.map((i) => (i.id === item.id ? item : i)));
                break;
            case 'news':
                setNews(news.map((i) => (i.id === item.id ? item : i)));
                break;
            case 'destinations':
                setDestinations(destinations.map((i) => (i.id === item.id ? item : i)));
                break;
            case 'alerts':
                setAlerts(alerts.map((i) => (i.id === item.id ? item : i)));
                break;
            default:
                break;
        }
        setEditingItem(null);
        toast({
            title: 'Item Saved',
            description: 'Your changes have been successfully saved.',
        });
    };
    const renderTable = (items, type) => (
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
                    <TableRow key={item.id}>
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
                            <Button class="btn a btn-edit" variant="outline" size="sm" onClick={() => handleEdit(item)} className="mr-2">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button class="btn a btn-delete" variant="outline" size="sm" onClick={() => handleDelete(type, item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div class="container">
            <h1 class="heading">Content Management System</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="tabs-list" >
                    <TabsTrigger className="tabs-trigger" value="promotions">Promotions</TabsTrigger>
                    <TabsTrigger className="tabs-trigger" value="news">News</TabsTrigger>
                    <TabsTrigger className="tabs-trigger" value="destinations">Destinations</TabsTrigger>
                    <TabsTrigger className="tabs-trigger" value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="promotions">
                    <Card className="card">
                        <CardHeader className="card-header">
                            <CardTitle className="card-title">Manage Promotions</CardTitle>
                            <CardDescription className="card-description">Add, edit, or remove promotional content</CardDescription>
                        </CardHeader>
                        <CardContent className="card-content">
                            {renderTable(promotions, 'promotions')}
                        </CardContent>
                        <CardFooter className="card-footer">
                            <Button className="btn" onClick={() => handleAdd('promotions')}>
                                <Plus className="icon plus-icon" /> Add Promotion
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="news">
                    <Card className="card">
                        <CardHeader className="card-header">
                            <CardTitle className="card-title">Manage News</CardTitle>
                            <CardDescription className="card-description">Add, edit, or remove news articles</CardDescription>
                        </CardHeader>
                        <CardContent className="card-content">
                            {renderTable(news, 'news')}
                        </CardContent>
                        <CardFooter className="card-footer">
                            <Button className="btn" onClick={() => handleAdd('news')}>
                                <Plus className="icon plus-icon" /> Add News
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="destinations">
                    <Card className="card">
                        <CardHeader className="card-header">
                            <CardTitle className="card-title">Manage Destinations</CardTitle>
                            <CardDescription className="card-description">
                                Add, edit, or remove featured destinations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="card-content">
                            {renderTable(destinations, 'destinations')}
                        </CardContent>
                        <CardFooter className="card-footer">
                            <Button className="btn" onClick={() => handleAdd('destinations')}>
                                <Plus className="icon plus-icon" /> Add Destination
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts">
                    <Card className="card">
                        <CardHeader className="card-header">
                            <CardTitle className="card-title">Manage Alerts</CardTitle>
                            <CardDescription className="card-description">
                                Add, edit, or remove important alerts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="card-content">
                            {renderTable(alerts, 'alerts')}
                        </CardContent>
                        <CardFooter className="card-footer">
                            <Button className="btn" onClick={() => handleAdd('alerts')}>
                                <Plus className="icon plus-icon" /> Add Alert
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>


            </Tabs>
            <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                <DialogContent className="dialog-content">
                    <DialogHeader className="dialog-header">
                        <DialogTitle className="dialog-title">
                            {editingItem?.id ? 'Edit' : 'Add'} Content
                        </DialogTitle>
                        <DialogDescription className="dialog-description">
                            {editingItem?.id
                                ? 'Edit the details of the content below.'
                                : 'Fill in the details for the new content.'}
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave(activeTab, editingItem);
                            }}
                            className="dialog-form"
                        >
                            <div className="form-section">
                                <div className="form-group">
                                    <Label htmlFor="title" className="form-label">Title</Label>
                                    <Input
                                        id="title"
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                {(activeTab === 'promotions' || activeTab === 'alerts') && (
                                    <div className="form-group">
                                        <Label htmlFor="description" className="form-label">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={editingItem.description}
                                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                            className="form-textarea"
                                        />
                                    </div>
                                )}
                                {activeTab === 'news' && (
                                    <div className="form-group">
                                        <Label htmlFor="content" className="form-label">Content</Label>
                                        <Textarea
                                            id="content"
                                            value={editingItem.content}
                                            onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                                            className="form-textarea"
                                        />
                                    </div>
                                )}
                                {(activeTab === 'promotions' || activeTab === 'alerts') && (
                                    <div className="form-group">
                                        <Label htmlFor="link" className="form-label">Link</Label>
                                        <Input
                                            id="link"
                                            value={editingItem.link}
                                            onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                )}
                                {activeTab === 'news' && (
                                    <div className="form-group">
                                        <Label htmlFor="date" className="form-label">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={editingItem.date}
                                            onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                )}
                                {(activeTab === 'promotions' || activeTab === 'news' || activeTab === 'destinations') && (
                                    <div className="form-group">
                                        <Label htmlFor="image" className="form-label">Image URL</Label>
                                        <Input
                                            id="image"
                                            value={editingItem.image}
                                            onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="dialog-footer">
                                <Button type="submit" className="dialog-button">Save</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )

}