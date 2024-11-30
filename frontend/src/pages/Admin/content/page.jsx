import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import "./styles.css";

export default function ContentManagement() {
    const [promotions, setPromotions] = useState([
        {
            id: 1,
            title: "Summer Sale",
            content: "Get up to 30% off on all international flights!",
            startDate: "2023-06-01",
            endDate: "2023-08-31",
        },
        {
            id: 2,
            title: "Spring Special",
            content: "Enjoy a 20% discount on selected routes!",
            startDate: "2023-04-01",
            endDate: "2023-06-30",
        },
    ]);

    const [newPromotion, setNewPromotion] = useState({
        title: "",
        content: "",
        startDate: "",
        endDate: "",
    });

    const [editingPromotion, setEditingPromotion] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPromotion({ ...newPromotion, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPromotion) {
            setPromotions(
                promotions.map((promo) =>
                    promo.id === editingPromotion.id
                        ? { ...editingPromotion, ...newPromotion }
                        : promo
                )
            );
            setEditingPromotion(null);
        } else {
            setPromotions([
                ...promotions,
                { ...newPromotion, id: promotions.length + 1 },
            ]);
        }
        setNewPromotion({ title: "", content: "", startDate: "", endDate: "" });
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        setNewPromotion({
            title: promotion.title,
            content: promotion.content,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
        });
    };

    const handleDelete = (id) => {
        setPromotions(promotions.filter((promo) => promo.id !== id));
    };

    return (
        <div className="content-management">
            <h1 className="content-management-title">Promotions Management</h1>

            <Dialog>
                <DialogTrigger>
                    <Button>
                        <Plus size={18} />
                        Add New Promotion
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingPromotion
                                    ? "Edit the details of the promotion below."
                                    : "Fill in the details for the new promotion."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="form-field">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={newPromotion.title}
                                onChange={handleInputChange}
                                placeholder="Enter title"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={newPromotion.content}
                                onChange={handleInputChange}
                                placeholder="Enter promotion details"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={newPromotion.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={newPromotion.endDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {editingPromotion ? "Update" : "Add"} Promotion
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="promotions-list">
                {promotions.map((promo) => (
                    <div key={promo.id} className="promotion-card">
                        <div className="promotion-card-header">
                            <div>
                                <h3>{promo.title}</h3>
                                <p>{promo.content}</p>
                                <p className="promotion-dates">
                                    Start Date: {promo.startDate}
                                </p>
                                <p className="promotion-dates">
                                    End Date: {promo.endDate}
                                </p>
                            </div>
                            <div className="card-actions">
                                <Button onClick={() => handleEdit(promo)}>
                                    <Edit size={18} />
                                </Button>
                                <Button onClick={() => handleDelete(promo.id)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {promotions.length === 0 && (
                    <div className="no-promotions">
                        <p>No promotions available</p>
                        <p>Add your first promotion to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
