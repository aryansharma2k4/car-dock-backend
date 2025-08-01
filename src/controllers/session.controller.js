import { Session } from "../schema/session.model.js";


const notifySixHours = async(req, res) => {
    try{
        const { sessionId } = req.params;
        const sessions = await Session.find({status: "Active"});
        const now = new Date();
        const diffMs = now - sessions.entryTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if(diffHours >= 6){
            return res.status(200).json({
                success: true,
                message: "6 hours have passed since the session started.",
                data: sessions
            })
        }
    }catch(error){
        console.error("Error in notifySixHours:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}
const getAllSession = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "Active" })
      .populate("parkVehicle")
      .populate("parkSlot");

    return res.status(200).json({ 
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error Getting All Sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getSession = async (req, res) => {
  try {
    const sessions = await Session.find({})
      .populate("parkVehicle")
      .populate("parkSlot");

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error Getting All Sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export { getAllSession, getSession, notifySixHours };
