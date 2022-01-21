
import { INote } from "../../../models/Note"
import Field from "../../Common/Field"
import Switch from "../../Common/Switch"
import styles from '../../../styles/NoteForm.module.css'
import { ChangeEvent, ChangeEventHandler, useState } from "react"
import Textarea from "../../Common/Textarea"
import Label from '../../Common/Label'
import Heading from "../../Common/Heading"
import Button from "../../Common/Button"
import { newNote, setNote } from "../../../api/notes"
import { useRouter } from "next/router"
import { formatDate } from "../../../utils/date"

interface NoteFormProps {
    note?:INote
}

// TODO: form tests

const NoteForm = ({note}: NoteFormProps) => {
    const [title, setTitle] = useState(note?.title || "")
    const [description, setDescription] = useState(note?.description || "")
    const [author, setAuthor] = useState(note?.author || "")
    const [isPrivate, setIsPrivate] = useState(note?.isPrivate || false)
    const [expires, setExpires] = useState(note?.expireAt ? true : false)
    const [expiryDate, setExpiryDate] = useState(note?.expireAt || null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    var minDate = new Date();
    // add a day
    minDate.setDate(minDate.getDate() + 1);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const body = {
            ...note,
            title,
            description,
            author,
            isPrivate,
            expireAt: expires && expiryDate ? expiryDate : null,
            schema_version: "2"
            
        }
        const options = {
            "method": note?._id ? "PUT":'POST',
            'headers': {
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            "body": JSON.stringify(body)
        };
        if (note?._id) {
            try {
                await setNote(note._id,options);
                router.replace(`${router.basePath}/${note._id}`)
            } catch (error) {
                console.error(error)
            }finally{
                setIsSubmitting(false)
            }
           
        } else {
           
            try {
                const note = await newNote(options);
                router.replace(`${router.basePath}/${note._id}`)
                
            } catch (error) {
                console.error(error)
            }finally{
                setIsSubmitting(false)
            }

        }
    }   

    return (
        <form data-testid="note-form" className={`${styles["form"]}`} onSubmit={handleSubmit}>
            <Heading className={`${styles["heading"]}`} color="primary">
                My  Note
            </Heading>
            <div className={`${styles["field"]}`}>
                <Field  label="Title" name="title" maxlength="100" defaultValue={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required autofocus />
            </div>
            <div className={`${styles["field"]}`}>
                <Label>Description</Label>
                <Textarea name="description" maxlength="3000" defaultValue={description} rows={8} onChange={(e: ChangeEventHandler<HTMLTextAreaElement>) => {setDescription(e.target.value)}} required />
            </div>
            <div className={`${styles["field"]}`}>
                <Field label="Author" name="author" defaultValue={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} required />
            </div>
            <div className={`${styles["field"]}`}>
                <Switch
                    label="Expires"
                    defaultChecked={expires}
                    onChange={e => setExpires(e.target.checked)}
                    sx={{
                        "bakgroundColor": 'gray',
                        'input:checked ~ &': {
                            backgroundColor: 'primary',
                        },
                    }}
                
                />
            </div>
            {expires ? <div className={`${styles["field"]}`}>
                <Field label="Expiry Date" name="expiry-date" type="date" defaultValue={formatDate(expiryDate ? new Date(expiryDate) : new Date())} min={minDate.toISOString().split("T")[0]} onChange={(e: ChangeEvent<HTMLInputElement>) => setExpiryDate(e.target.value)}/>
            </div> : ""}
            <div className={`${styles["field"]}`}>
                <Switch
                    label="Private Note"
                    defaultChecked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    sx={{
                        "bakgroundColor": 'gray',
                        'input:checked ~ &': {
                            backgroundColor: 'secondary',
                        },
                    }}
                
                />
            </div>
            <Button disabled={isSubmitting} text={note?._id ? "Save Changes" : "Create"} type="submit" />
        </form>
    )
}

export default NoteForm
