
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

interface NoteFormProps {
    note?:INote
}

// TODO: display errors to user 
// TODO: form tests

const NoteForm = ({note}: NoteFormProps) => {
    const [title, setTitle] = useState(note?.title || "")
    const [description, setDescription] = useState(note?.description || "")
    const [author, setAuthor] = useState(note?.author || "")
    const [isPrivate, setIsPrivate] = useState(note?.isPrivate || false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const router = useRouter()
   
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const body = {
            ...note,
            title,
            description,
            author,
            isPrivate
            
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
                <Field  label="Title" name="title" defaultValue={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
            </div>
            <div className={`${styles["field"]}`}>
                <Label>Description</Label>
                <Textarea name="description" defaultValue={description} rows={8} onChange={(e: ChangeEventHandler<HTMLTextAreaElement>) => {setDescription(e.target.value)}}/>
            </div>
            <div className={`${styles["field"]}`}>
                <Field label="Author" name="author" defaultValue={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}/>
            </div>
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
