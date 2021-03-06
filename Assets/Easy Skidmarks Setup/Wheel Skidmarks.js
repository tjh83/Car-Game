#pragma strict

@script RequireComponent(WheelCollider)//We need a wheel collider

var skidCaller : GameObject;//The parent oject having a rigidbody attached to it.
var startSlipValue : float = 6.5;
private var skidmarks : Skidmarks = null;//To hold the skidmarks object
private var lastSkidmark : int = -1;//To hold last skidmarks data
private var wheel_col : WheelCollider;//To hold self wheel collider

var skidSmoke: GameObject;
var smokeDepth : float = 0.4;

function Start ()
	{
	//GSH stuff
	skidSmoke.transform.position = transform.position;
	skidSmoke.transform.position.y -= smokeDepth;
	
	
	//Get the Wheel Collider attached to self
	wheel_col = GetComponent(WheelCollider);
	//find object "Skidmarks" from the game
	if(FindObjectOfType(Skidmarks))
	{
		skidmarks = FindObjectOfType(Skidmarks);
	}
	else
		Debug.Log("No skidmarks object found. Skidmarks will not be drawn");
	}

function FixedUpdate () //This has to be in fixed update or it wont get time to make skidmesh fully.
	{
	var GroundHit : WheelHit; //variable to store hit data
	wheel_col.GetGroundHit( GroundHit );//store hit data into GroundHit
	var wheelSlipAmount = Mathf.Abs( GroundHit.sidewaysSlip );
	var forwardSlip = Mathf.Abs(GroundHit.forwardSlip);
	
	/*Calculate skid point:
	Since the body moves very fast, the skidmarks would appear away from the wheels because by the time the
	skidmarks are made the body would have moved forward. So we multiply the rigidbody's velocity vector x 2 
	to get the correct position
	*/
	
	var skidPoint : Vector3 = GroundHit.point + 2*(skidCaller.rigidbody.velocity) * Time.deltaTime;
	
	if ( wheelSlipAmount > startSlipValue ) //if sideways slip is more than desired value
	{
	
	skidSmoke.particleEmitter.emit = true;
	
	

	//Add skidmark at the point using AddSkidMark function of the Skidmarks object
	//Syntax: AddSkidMark(Point, Normal, Intensity(max value 1), Last Skidmark index);
	lastSkidmark = skidmarks.AddSkidMark(skidPoint, GroundHit.normal, wheelSlipAmount/25, lastSkidmark);
	
	} else if(forwardSlip > 2){
	
	//var skidPoint : Vector3 = GroundHit.point + 2*(skidCaller.rigidbody.velocity) * Time.deltaTime;
	
	//Add skidmark at the point using AddSkidMark function of the Skidmarks object
	//Syntax: AddSkidMark(Point, Normal, Intensity(max value 1), Last Skidmark index);
	lastSkidmark = skidmarks.AddSkidMark(skidPoint, GroundHit.normal, wheelSlipAmount*10/*Set intensity to high for forward slip*/, lastSkidmark);	
	
	}
	else
	{
	skidSmoke.particleEmitter.emit = false;//stop skidsmoke
	//stop making skidmarks
	lastSkidmark = -1;
	}
			
	}